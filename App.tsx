import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import {
  useFonts,
  RobotoMono_400Regular,
  RobotoMono_700Bold,
} from "@expo-google-fonts/roboto-mono";
import Constants from "expo-constants";

import Main from "./Main";
import { DatabaseContextProvider } from "./database/DatabaseContext";
import * as Notifications from "expo-notifications";

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const dbVersion = Number(Constants.expoConfig?.extra?.dbVersion ?? 1);

  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value INTEGER NOT NULL
    );
  `);

  const storedVersionResult = await db.getFirstAsync<{ value: number }>(
    `SELECT value FROM meta WHERE key = 'dbVersion'`,
  );
  const storedVersion = storedVersionResult?.value ?? 0;

  if (storedVersion !== dbVersion) {
    alert("updating schema");
    await db.execAsync(`
      DROP TABLE IF EXISTS stop_watches;
      DROP TABLE IF EXISTS banked_time;
      DROP TABLE IF EXISTS log;
    `);
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS stop_watches (
      id TEXT PRIMARY KEY NOT NULL,
      state TEXT NOT NULL,
      startedAtMillis INTEGER,
      accumulatedMillis INTEGER NOT NULL,
      intervals TEXT
    );

    CREATE TABLE IF NOT EXISTS banked_time (
      key TEXT PRIMARY KEY NOT NULL,
      intervals TEXT NOT NULL,
      manualRecords TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS log (
      ts INTEGER NOT NULL,
      value TEXT NOT NULL
    );
  `);

  if (storedVersion !== dbVersion) {
    await db.runAsync(
      `INSERT OR REPLACE INTO meta (key, value) VALUES ('dbVersion', ?)`,
      [dbVersion],
    );
  }
}

// 👇 put it HERE (top-level, outside component)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [fontsLoaded] = useFonts({
    TimerFont: RobotoMono_400Regular,
    TimerFontBold: RobotoMono_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="bankedTimes.db" onInit={migrateDbIfNeeded}>
        <DatabaseContextProvider>
          <Main />
        </DatabaseContextProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
};

export default App;
