import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Helper function to parse time strings (HH:MM format) to minutes
function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr || timeStr === "") return 0;
  const parts = timeStr.split(":");
  if (parts.length !== 2) return 0;
  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  return hours * 60 + minutes;
}

// Helper function to convert minutes back to HH:MM format
function minutesToTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

// Helper function to calculate flight statistics from logbook entries
async function calculateFlightStatistics(db: any, pilotId: string) {
  const logbooks = await db
    .collection("logbooks")
    .find({
      pilot:  new ObjectId(pilotId) ,
    })
    .toArray();

  let totalFlightTimeMinutes = 0;
  let picTimeMinutes = 0;
  let sicTimeMinutes = 0;
  let dualTimeMinutes = 0;
  let nightTimeMinutes = 0;
  let ifrTimeMinutes = 0;
  let simulatorTimeMinutes = 0;
  let crossCountryTimeMinutes = 0;
  let soloTimeMinutes = 0;
  let dualGivenTimeMinutes = 0;
  let dualReceivedTimeMinutes = 0;

  let totalFlights = 0;
  let dayLandings = 0;
  let nightLandings = 0;
  let last30DaysMinutes = 0;

  const visitedAirports = new Set<string>();
  const aircraftTypes = new Set<string>();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  logbooks.forEach((entry) => {
    // Parse flight times
    totalFlightTimeMinutes += parseTimeToMinutes(entry.totalFlightTime || "");

    // Role-based time calculation
    if (entry.role === "PIC") {
      picTimeMinutes += parseTimeToMinutes(entry.totalFlightTime || "");
    } else if (entry.role === "SIC" || entry.role === "Co-Pilot") {
      sicTimeMinutes += parseTimeToMinutes(entry.totalFlightTime || "");
    }

    // Other time types
    dualTimeMinutes += parseTimeToMinutes(entry.dualTime || "");
    nightTimeMinutes += parseTimeToMinutes(entry.nightTime || "");
    ifrTimeMinutes += parseTimeToMinutes(entry.ifrTime || "");
    simulatorTimeMinutes += parseTimeToMinutes(entry.simulatorTime || "");

    // For cross country, assume flights between different airports are cross country
    if (entry.departureAerodrome !== entry.destinationAerodrome) {
      crossCountryTimeMinutes += parseTimeToMinutes(
        entry.totalFlightTime || ""
      );
    }

    // Count flights and landings
    totalFlights++;
    dayLandings += entry.landingsDay || 0;
    nightLandings += entry.landingsNight || 0;

    // Last 30 days calculation
    const flightDate = new Date(entry.date);
    if (flightDate >= thirtyDaysAgo) {
      last30DaysMinutes += parseTimeToMinutes(entry.totalFlightTime || "");
    }

    // Collect airports and aircraft types
    if (entry.departureAerodrome) visitedAirports.add(entry.departureAerodrome);
    if (entry.destinationAerodrome)
      visitedAirports.add(entry.destinationAerodrome);
    if (entry.aircraftType) aircraftTypes.add(entry.aircraftType);
  });

  return {
    totalFlightTime: minutesToTimeString(totalFlightTimeMinutes),
    picTime: minutesToTimeString(picTimeMinutes),
    sicTime: minutesToTimeString(sicTimeMinutes),
    dualTime: minutesToTimeString(dualTimeMinutes),
    soloTime: minutesToTimeString(
      Math.max(0, picTimeMinutes - dualTimeMinutes)
    ), // Estimate solo time
    crossCountryTime: minutesToTimeString(crossCountryTimeMinutes),
    nightTime: minutesToTimeString(nightTimeMinutes),
    instrumentTime: minutesToTimeString(ifrTimeMinutes),
    simulatorTime: minutesToTimeString(simulatorTimeMinutes),
    dualGivenTime: minutesToTimeString(dualGivenTimeMinutes),
    dualReceivedTime: minutesToTimeString(dualReceivedTimeMinutes),
    last30Days: Math.round((last30DaysMinutes / 60) * 10) / 10, // Convert to hours with 1 decimal
    totalFlights,
    dayLandings,
    nightLandings,
    visitedAirports: Array.from(visitedAirports).sort(),
    aircraftTypes: Array.from(aircraftTypes).sort(),
  };
}
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db("flyclim");

    // Find pilot by username with public profile enabled
    const pilot = await db.collection("pilotprofiles").findOne({
      "publicProfile.username": params.username,
      "publicProfile.enabled": true,
    });

    if (!pilot) {
      return NextResponse.json(
        { error: "Pilot not found or profile not public" },
        { status: 404 }
      );
    }

    // Base public data always available
    const publicData = {
      _id: pilot._id.toString(),
      user:pilot.userId.toString(),
      firstName: pilot.firstName,
      lastName: pilot.lastName,
      profileImage: pilot.profileImage,
      bio: pilot.bio,
      location: pilot.location,
      airline: pilot.airline,
      publicProfile: pilot.publicProfile,
      socialLinks: pilot.socialLinks || {},
      createdAt: pilot.createdAt,
    };

    // Add optional fields based on privacy settings
    if (pilot.publicProfile.showEmployment && pilot.employers) {
      publicData.employers = pilot.employers.map((emp) => ({
        id: emp.id,
        name: emp.name,
        position: emp.position,
        startDate: emp.startDate,
        endDate: emp.endDate,
        current: emp.current,
      }));
    }

    if (pilot.publicProfile.showCertificates && pilot.certificates) {
      publicData.certificates = pilot.certificates.map((cert) => ({
        id: cert.id,
        type: cert.type,
        name: cert.name,
        number: cert.number,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        authority: cert.authority,
        notes: cert.notes,
      }));
    }

    if (pilot.publicProfile.showContactInfo) {
      publicData.email = pilot.email;
    }

    // Calculate flight experience from logbooks if showFlightHours is enabled
    console.log(pilot.userId)
    if (pilot.publicProfile.showFlightHours) {
      const flightStats = await calculateFlightStatistics(
        db,
        pilot.userId.toString()
      );
      publicData.experience = flightStats;
    }

    return NextResponse.json(publicData);
  } catch (error) {
    console.error("Failed to fetch pilot:", error);
    return NextResponse.json(
      { error: "Failed to fetch pilot" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
