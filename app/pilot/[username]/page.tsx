import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PilotProfile } from "@/components/PilotProfile";
import { PilotDeepLink } from "@/components/PilotDeepLink";
import { Metadata } from "next";
import { MongoClient } from "mongodb";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db("flyclim");
    const pilot = await db.collection("pilotprofiles").findOne({
      "publicProfile.username": params.username,
      "publicProfile.enabled": true,
    });

    if (!pilot) {
      return {
        title: "Pilot Not Found",
        description: "The requested pilot profile could not be found.",
      };
    }

    return {
      title: `${pilot.firstName} ${pilot.lastName} - Pilot Profile`,
      description:
        pilot.bio ||
        `Professional pilot profile for ${pilot.firstName} ${pilot.lastName}`,
      alternates: {
        canonical: `https://flyclim.com/pilot/${params.username}`,
      },
      other: {
        "al:ios:url": `flyclim://pilot/${params.username}`,
        "al:ios:app_store_id": "123456789", // Replace with actual App Store ID
        "al:ios:app_name": "FlyClim",
        "al:android:url": `flyclim://pilot/${params.username}`,
        "al:android:package": "com.flyclim.app", // Replace with actual package name
        "al:android:app_name": "FlyClim",
        "al:web:url": `https://flyclim.com/pilot/${params.username}`,
      },
      openGraph: {
        title: `${pilot.firstName} ${pilot.lastName} - FlyClim Pilot`,
        description:
          pilot.bio ||
          `Professional pilot profile for ${pilot.firstName} ${pilot.lastName}`,
        type: "profile",
        url: `https://flyclim.com/pilot/${params.username}`,
        images: pilot.profileImage ? [pilot.profileImage] : ["/logo.png"],
      },
      twitter: {
        card: "summary_large_image",
        title: `${pilot.firstName} ${pilot.lastName} - FlyClim Pilot`,
        description:
          pilot.bio ||
          `Professional pilot profile for ${pilot.firstName} ${pilot.lastName}`,
        images: pilot.profileImage ? [pilot.profileImage] : ["/logo.png"],
        // app: {
        //   name: "FlyClim",
        //   id: {
        //     iphone: "123456789", // Replace with actual App Store ID
        //     ipad: "123456789",
        //     googleplay: "com.flyclim.app", // Replace with actual package name
        //   },
        //   url: {
        //     iphone: `flyclim://pilot/${params.username}`,
        //     ipad: `flyclim://pilot/${params.username}`,
        //     googleplay: `flyclim://pilot/${params.username}`,
        //   },
        // },
      },
    };
  } catch (error) {
    console.error("Failed to fetch pilot metadata:", error);
    return {
      title: "Pilot Profile",
      description: "FlyClim pilot profile",
    };
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export default function PilotProfilePage({
  params,
}: {
  params: { username: string };
}) {
  return (
    <main className="min-h-screen">
      <PilotDeepLink username={params.username} />
      <Navigation />
      <PilotProfile username={params.username} />
      <Footer />
    </main>
  );
}
