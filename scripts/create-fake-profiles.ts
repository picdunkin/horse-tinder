import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import "dotenv/config";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        "Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_DB_PASSWORD.",
    );
  }

  return value;
}

// Configuration
const SUPABASE_URL = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
const PASSWORD = getRequiredEnv("SUPABASE_DB_PASSWORD");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Fake profile data
const fakeProfiles = [
  {
    full_name: "Bella Meadowbrook",
    username: "bella_meadowbrook",
    email: "bella.meadowbrook@stable.example.com",
    gender: "female" as const,
    birthdate: "2017-03-15",
    bio: "Chestnut mare with a soft spot for apple slices, sunset trail rides, and dramatic mane flips.",
    avatar_url:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 4, max: 12 },
      distance: 50,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "Daisy Cloverfield",
    username: "daisy_cloverfield",
    email: "daisy.cloverfield@stable.example.com",
    gender: "female" as const,
    birthdate: "2016-07-22",
    bio: "Elegant gray mare who loves open paddocks, peppermint treats, and a gentle trot at dawn.",
    avatar_url:
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 5, max: 14 },
      distance: 30,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "Rosie Windrunner",
    username: "rosie_windrunner",
    email: "rosie.windrunner@stable.example.com",
    gender: "female" as const,
    birthdate: "2015-11-08",
    bio: "Curious bay mare looking for a kind stallion to share meadow sprints and quiet barn evenings.",
    avatar_url:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 6, max: 15 },
      distance: 25,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "Thunder Gallop",
    username: "thunder_gallop",
    email: "thunder.gallop@stable.example.com",
    gender: "male" as const,
    birthdate: "2014-05-12",
    bio: "Strong black stallion with championship energy. Into fence-line flirting, fast runs, and extra hay.",
    avatar_url:
      "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 4, max: 12 },
      distance: 40,
      gender_preference: ["female"],
    },
  },
  {
    full_name: "Maple Sugarhoof",
    username: "maple_sugarhoof",
    email: "maple.sugarhoof@stable.example.com",
    gender: "female" as const,
    birthdate: "2018-09-18",
    bio: "Playful palomino mare. I bring golden-hour looks, chaotic zoomies, and excellent pasture gossip.",
    avatar_url:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 4, max: 10 },
      distance: 35,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "Copper Canyon",
    username: "copper_canyon",
    email: "copper.canyon@stable.example.com",
    gender: "male" as const,
    birthdate: "2013-12-03",
    bio: "Trail-loving gelding energy in a stallion body. Loyal, calm, and always first to the water trough.",
    avatar_url:
      "https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 5, max: 13 },
      distance: 45,
      gender_preference: ["female"],
    },
  },
  {
    full_name: "Willow Briar",
    username: "willow_briar",
    email: "willow.briar@stable.example.com",
    gender: "female" as const,
    birthdate: "2016-02-28",
    bio: "Gentle mare seeking a pasture partner who appreciates slow grazes, warm blankets, and moonlit canters.",
    avatar_url:
      "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 5, max: 12 },
      distance: 30,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "Blaze Ironhoof",
    username: "blaze_ironhoof",
    email: "blaze.ironhoof@stable.example.com",
    gender: "male" as const,
    birthdate: "2015-06-14",
    bio: "Athletic stallion who lives for barrel turns, thunder runs, and showing off a perfectly braided mane.",
    avatar_url:
      "https://images.unsplash.com/photo-1566251037378-5e04e3bec343?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 4, max: 12 },
      distance: 50,
      gender_preference: ["female"],
    },
  },
  {
    full_name: "Luna Starbrook",
    username: "luna_starbrook",
    email: "luna.starbrook@stable.example.com",
    gender: "female" as const,
    birthdate: "2019-08-07",
    bio: "Young spirited mare with big ears, bigger dreams, and a deep respect for premium carrots.",
    avatar_url:
      "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 3, max: 10 },
      distance: 25,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "Oakley Dusttrail",
    username: "oakley_dusttrail",
    email: "oakley.dusttrail@stable.example.com",
    gender: "male" as const,
    birthdate: "2012-04-25",
    bio: "Steady older stallion. Reliable stride, excellent stable manners, and unmatched skill at finding snack buckets.",
    avatar_url:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 5, max: 14 },
      distance: 40,
      gender_preference: ["female"],
    },
  },
];

async function createFakeProfiles() {
  console.log("🚀 Starting to create fake profiles...");

  for (let i = 0; i < fakeProfiles.length; i++) {
    const profile = fakeProfiles[i];

    try {
      console.log(`\n📝 Creating profile ${i + 1}/10: ${profile.full_name}`);

      // 1. Check if auth user already exists
      const { data: existingAuthUsers } = await supabase.auth.admin.listUsers();
      const existingAuthUser = existingAuthUsers.users.find(
        (u) => u.email === profile.email,
      );

      let userId: string;

      if (existingAuthUser) {
        console.log(
          `⚠️ Auth user already exists for ${profile.full_name}, using existing...`,
        );
        userId = existingAuthUser.id;
      } else {
        // Create new auth user
        const { data: authData, error: authError } =
          await supabase.auth.admin.createUser({
            email: profile.email,
            password: PASSWORD,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
              full_name: profile.full_name,
              username: profile.username,
            },
          });

        if (authError) {
          console.error(
            `❌ Error creating auth user for ${profile.full_name}:`,
            authError,
          );
          continue;
        }

        userId = authData.user.id;
        console.log(`✅ Auth user created: ${userId}`);
      }

      // 2. Check if user profile already exists
      const { data: existingProfile } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single();

      if (existingProfile) {
        console.log(
          `⚠️ Profile already exists for ${profile.full_name}, updating...`,
        );

        // Update existing profile with new data
        const { error: updateError } = await supabase
          .from("users")
          .update({
            full_name: profile.full_name,
            username: profile.username,
            email: profile.email,
            gender: profile.gender,
            birthdate: profile.birthdate,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            preferences: profile.preferences,
            location_lat: faker.location.latitude({ min: 37.7, max: 37.8 }), // San Francisco area
            location_lng: faker.location.longitude({
              min: -122.5,
              max: -122.4,
            }),
            is_verified: true,
            is_online: Math.random() > 0.5,
          })
          .eq("id", userId);

        if (updateError) {
          console.error(
            `❌ Error updating profile for ${profile.full_name}:`,
            updateError,
          );
          continue;
        }
      } else {
        // Insert new user profile data
        const { error: profileError } = await supabase.from("users").insert({
          id: userId,
          full_name: profile.full_name,
          username: profile.username,
          email: profile.email,
          gender: profile.gender,
          birthdate: profile.birthdate,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          preferences: profile.preferences,
          location_lat: faker.location.latitude({ min: 37.7, max: 37.8 }), // San Francisco area
          location_lng: faker.location.longitude({ min: -122.5, max: -122.4 }),
          is_verified: true,
          is_online: Math.random() > 0.5,
        });

        if (profileError) {
          console.error(
            `❌ Error creating profile for ${profile.full_name}:`,
            profileError,
          );
          // Try to clean up the auth user if profile creation fails
          await supabase.auth.admin.deleteUser(userId);
          continue;
        }
      }

      console.log(`✅ Profile created successfully for ${profile.full_name}`);
      console.log(`   📧 Email: ${profile.email}`);
      console.log(`   🔑 Password: ${PASSWORD}`);
      console.log(`   👤 Username: ${profile.username}`);
    } catch (error) {
      console.error(
        `❌ Unexpected error creating profile for ${profile.full_name}:`,
        error,
      );
    }
  }

  console.log("\n🎉 Fake profile creation completed!");
  console.log("\n📋 Summary:");
  console.log('All accounts use password: "password"');
  console.log("All emails are auto-confirmed");
  console.log("Profiles include random location data in San Francisco area");
  console.log("Some users are marked as online for testing");
}

// Run the script
createFakeProfiles().catch(console.error);
