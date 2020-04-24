import React from "react";
import { View, Platform, Switch, SafeAreaView, StatusBar } from "react-native";
import {
  Text,
  Button,
  Icon,
  Slider,
  withTheme,
  Tooltip,
} from "react-native-elements";
import EStyleSheet from "react-native-extended-stylesheet";
import { Logs } from "expo";
import I18n from "i18n-js";
import Constants from "expo-constants";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";

const PRECISION = 1000;

if (__DEV__ && Platform.OS !== "web") {
  Logs.disableExpoCliLogging();
}

EStyleSheet.clearCache();
EStyleSheet.build();

function App({ theme }) {
  const colorScheme = useColorScheme();

  const [state, setState] = React.useState({
    count: 0,
    lastTimeout: 0,
    running: false,
    precision: PRECISION,
    darkMode: colorScheme === "dark",
  });

  React.useEffect(() => {
    let timeout;
    if (state.running) {
      timeout = setTimeout(() => {
        setState({
          ...state,
          count: state.count + (Date.now() - state.lastTimeout),
          lastTimeout: Date.now(),
        });
      }, state.precision);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  });

  const start = () => {
    if (!state.running) {
      setState({
        ...state,
        lastTimeout: Date.now(),
        running: true,
      });
    }
  };

  const stop = () => {
    if (state.running) {
      setState({ ...state, running: false });
    }
  };

  const reset = () => {
    setState({ ...state, count: 0 });
  };

  const date = new Date(state.count);

  const toStr = (value, padding = 3, pattern = "0000") => {
    const str = "" + value;
    return pattern.substring(0, padding - str.length) + str;
  };

  const formatDate = (date) => {
    return `${toStr(date.getHours() - 19, 2)}:${toStr(
      date.getMinutes(),
      2
    )}:${toStr(date.getSeconds(), 2)}:${toStr(date.getMilliseconds(), 3)}`;
  };

  const toggleDarkMode = () => {
    setState({ ...state, darkMode: !state.darkMode });
  };

  return (
    <AppearanceProvider>
      <View style={[styles.statusBar]} />
      {/* <StatusBar
        barStyle={"light-content"}
        backgroundColor={theme.colors.primary}
      />*/}
      <View style={styles.container}>
        {/*<SafeAreaView style={styles.container}>*/}

        <View style={styles.center}>
          <View style={styles.switchView}>
            <Text>Dark mode</Text>
            <Switch
              style={styles.switch}
              value={state.darkMode}
              onValueChange={() => toggleDarkMode()}
            />
          </View>
          <Text style={styles.counter}>{formatDate(date)}</Text>
          <Button
            disabled={state.running}
            onPress={start}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.button}
            title="START"
          />
          <Button
            disabled={!state.running}
            onPress={stop}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.button}
            title="STOP"
          />
          <Button
            onPress={reset}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.button}
            title="RESET"
          />
          {Platform.OS !== "web" && (
            <Slider
              thumbTintColor={theme.colors.primary}
              style={styles.slider}
              minimumValue={10}
              maximumValue={1000}
              step={10}
              value={state.precision}
              onValueChange={(value) =>
                setState({ ...state, precision: value })
              }
            />
          )}
          <View style={styles.tooltipView}>
            <Text style={styles.precision}>
              Precision {toStr(state.precision, 4, "    ")} ms
            </Text>
            {Platform.OS !== "web" && (
              <View style={styles.tooltip}>
                <Tooltip
                  width={300}
                  height={50}
                  popover={<Text>Period between computations of time</Text>}
                >
                  <Icon
                    iconStyle={[{ color: theme.colors.primary }]}
                    name="info-circle"
                    type="font-awesome"
                  />
                </Tooltip>
              </View>
            )}
          </View>
        </View>
      </View>
    </AppearanceProvider>
  );
}

const styles = EStyleSheet.create({
  switchView: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  switch: {
    marginLeft: ".75rem",
  },
  slider: {
    marginTop: "1rem",
  },
  tooltipView: {
    alignItems: "center",
    flexDirection: "row",
    paddingTop: "1rem",
  },
  tooltip: {
    marginLeft: "1rem",
  },
  statusBar: {
    minHeight: Constants.statusBarHeight,
  },
  center: {
    alignItems: "stretch",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    paddingLeft: "3rem",
    paddingRight: "3rem",
    ...Platform.select({
      web: {
        width: 500,
        margin: "auto",
      },
    }),
  },
  counter: {
    marginTop: "1rem",
    fontSize: 43,
    fontWeight: "bold",
    alignSelf: "center",
    ...Platform.select({
      web: {
        fontSize: 70,
      },
    }),
  },
  button: {
    marginTop: "1rem",
  },
  buttonStyle: {
    padding: "1rem",
  },
  precision: {
    ...Platform.select({
      android: {
        fontFamily: "monospace",
      },
      web: {
        fontFamily: "monospace",
      },
    }),
    color: "#aaa",
  },
});

export default withTheme(App);
