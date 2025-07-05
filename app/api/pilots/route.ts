import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Helper function to parse time strings and calculate basic stats
async function getBasicFlightStats(db: any, pilotId: string) {
  const logbooks = await db
    .collection("logbooks")
    .find({
      pilot: new ObjectId(pilotId),
    })
    .toArray();
  console.log("logbooks", logbooks);

  let totalMinutes = 0;
  let picMinutes = 0;
  let totalFlights = 0;
  let last30DaysMinutes = 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  logbooks.forEach((entry: any) => {
    const flightTime = entry.totalFlightTime || "";
    if (flightTime) {
      const parts = flightTime.split(":");
      if (parts.length === 2) {
        const hours = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;
        const entryMinutes = hours * 60 + minutes;

        totalMinutes += entryMinutes;
        totalFlights++;

        if (entry.role === "PIC") {
          picMinutes += entryMinutes;
        }

        const flightDate = new Date(entry.date);
        if (flightDate >= thirtyDaysAgo) {
          last30DaysMinutes += entryMinutes;
        }
      }
    }
  });

  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;
  const picHours = Math.floor(picMinutes / 60);
  const picMins = picMinutes % 60;

  return {
    totalFlightTime: `${totalHours}:${totalMins.toString().padStart(2, "0")}`,
    picTime: `${picHours}:${picMins.toString().padStart(2, "0")}`,
    last30Days: Math.round((last30DaysMinutes / 60) * 10) / 10,
    totalFlights,
  };
}
export async function GET(request: NextRequest) {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db("flyclim");

    // Fetch only pilots with public profiles enabled
    const pilots = await db
      .collection("pilotprofiles")
      .find({
        "publicProfile.enabled": true,
      })
      .sort({ firstName: 1, lastName: 1 })
      .toArray();

    // Process pilots and add flight experience if needed
    const processedPilots = await Promise.all(
      pilots.map(async (pilot) => {
        const pilotData: {
          _id: string;
          user: any;
          firstName: any;
          lastName: any;
          airline: any;
          location: any;
          bio: any;
          profileImage: any;
          publicProfile: any;
          socialLinks: any;
          employers: any;
          createdAt: any;
          certificateCount: any;
          experience?: {
            totalFlightTime: string;
            picTime: string;
            last30Days: number;
            totalFlights: number;
          };
        } = {
          _id: pilot._id.toString(),
          user: pilot.userId.toString(),
          firstName: pilot.firstName,
          lastName: pilot.lastName,
          airline: pilot.airline,
          location: pilot.location,
          bio: pilot.bio,
          profileImage: pilot.profileImage,
          publicProfile: pilot.publicProfile,
          socialLinks: pilot.socialLinks,
          employers: pilot.employers?.filter((emp: any) => emp.current) || [],
          createdAt: pilot.createdAt,
          certificateCount: pilot.publicProfile.showCertificates
            ? pilot.certificates?.length || 0
            : undefined,
        };

        // Add flight experience if showFlightHours is enabled
        if (pilot.publicProfile.showFlightHours) {
          try {
            const flightStats = await getBasicFlightStats(
              db,
              pilot.userId.toString()
            );
            pilotData.experience = flightStats;
          } catch (error) {
            console.error(
              `Failed to get flight stats for pilot ${pilot._id}:`,
              error
            );
            // Fallback to default values
            pilotData.experience = {
              totalFlightTime: "0:00",
              picTime: "0:00",
              last30Days: 0,
              totalFlights: 0,
            };
          }
        }

        return pilotData;
      })
    );
    return NextResponse.json({
      pilots: processedPilots,
    });
  } catch (error) {
    console.error("Failed to fetch pilots:", error);
    return NextResponse.json(
      { error: "Failed to fetch pilots" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
