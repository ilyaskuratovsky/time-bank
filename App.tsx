import React from "react";
import {
  useSafeAreaInsets,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
//import { useFonts } from "@expo-google-fonts/roboto-mono";
// import {
//   SpaceMono_400Regular,
//   RobotoMono_400Regular,
//   RobotoMono_700Bold,
// } from "@expo-google-fonts/space-mono";

import {
  useFonts,
  RobotoMono_400Regular,
  RobotoMono_700Bold,
} from "@expo-google-fonts/roboto-mono";

import Main from "./Main"; // Import the CurrentBank component
import { DatabaseContextProvider } from "./database/DatabaseContext";

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS banked_time (
      key VARCHAR PRIMARY KEY NOT NULL, 
      value INTEGER NOT NULL
    );
  `);
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS log (
      ts INTEGER NOT NULL,
      value TEXT NOT NULL
    );
  `);
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
  DROP TABLE IF EXISTS stop_watches;
    CREATE TABLE IF NOT EXISTS stop_watches (
      id STRING PRIMARY KEY NOT NULL,
      state VARCHAR NOT NULL,
      accumulatedMillis INTEGER NULL,
        currentStartTimestampMillis INTEGER NULL
      );
  `);
  //`INSERT INTO stop_watches (id, state, accumulatedMillis, currentStartTimestampMillis)
  // await db.execAsync(`
  //   PRAGMA journal_mode = WAL;
  //  DROP TABLE IF EXISTS stop_watches;
  //   CREATE TABLE IF NOT EXISTS stop_watches (
  //     id INTEGER PRIMARY KEY NOT NULL,
  //     state VARCHAR NOT NULL,
  //     accumulatedMillis INTEGER NOT NULL,
  //     currentStartTimestampMillis INTEGER NOT NULLs
  //   );
  // `);
}
const App = () => {
  let [fontsLoaded] = useFonts({
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
