// TEMPORARY connection test (Phase 2). Replaced by the real Home in Phase 3.
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Index() {
  const [lines, setLines] = useState<string[]>(["Not tested yet"]);

  async function testConnection() {
    const result: string[] = [];

    // 1. Not logged in: the security rules should block this.
    await supabase.auth.signOut();
    const blocked = await supabase.from("medicines").select("name");
    result.push(
      blocked.error || blocked.data?.length === 0
        ? "Without login: blocked (good)"
        : "Without login: data visible (security problem!)",
    );

    // 2. Log in as the test patient.
    const login = await supabase.auth.signInWithPassword({
      email: process.env.EXPO_PUBLIC_TEST_EMAIL ?? "",
      password: process.env.EXPO_PUBLIC_TEST_PASSWORD ?? "",
    });
    if (login.error) {
      setLines([...result, "Login failed: " + login.error.message]);
      return;
    }
    result.push("Logged in as " + login.data.user.email);

    // 3. Read her medicines.
    const medicines = await supabase
      .from("medicines")
      .select("name")
      .order("name");
    if (medicines.error) {
      setLines([...result, "Reading failed: " + medicines.error.message]);
      return;
    }
    result.push("", ...medicines.data.map((m) => m.name));
    setLines(result);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        gap: 16,
      }}
    >
      <Button title="Test connection" onPress={testConnection} />
      {lines.map((line, i) => (
        <Text key={i} style={{ fontSize: 18, textAlign: "center" }}>
          {line}
        </Text>
      ))}
    </View>
  );
}
