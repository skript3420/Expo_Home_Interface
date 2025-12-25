import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, {
    Circle,
    Defs,
    G,
    LinearGradient,
    Path,
    Polyline,
    Rect,
    Stop,
    Text
} from 'react-native-svg';

interface ActhorGaugeProps {
    temperature?: number;
    power?: number;
    maxPower?: number;
    boostactive?: number;
    isConnected?: boolean;
    onBoostPress?: () => void;
}

const ActhorGauge: React.FC<ActhorGaugeProps> = ({
    temperature = 0,
    power = 0,
    boostactive = 0,
    isConnected = false,
    onBoostPress
}) => {
    const COLORS = {
        blue: "rgb(59, 103, 165)",
        lightBlue: "rgb(229, 240, 255)",
        gray: "gray",
        white: "white",
        yellow: "yellow",
        green: "rgb(0, 255, 0)",
        red: "darkred"
    };

    const handleBoost = () => {
        if (onBoostPress) {
            onBoostPress();
        } else {
            Alert.alert("Boost", "Boost button pressed, not implemented");
        }
    };

    return (
        <View style={styles.container}>

            {/* 1. MAIN BACKGROUND GAUGE SVG */}
            <Svg
                width="100%"
                height="100%"
                viewBox="0 0 700 400"
            >
                <Defs>
                    <LinearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="red" />
                        <Stop offset="100%" stopColor="blue" />
                    </LinearGradient>
                </Defs>

                {/* Background */}
                <Rect width="100%" height="100%" fill={COLORS.lightBlue} />

                {/* Header Bar */}
                <Rect width="100%" height="48" fill={COLORS.blue} />
                <Text
                    x="350"
                    y="36"
                    fill={COLORS.white}
                    fontSize="32"
                    textAnchor="middle"
                    fontWeight="bold"
                >
                    AC•THOR 1 - M1
                </Text>

                {/* Temperature Readout */}
                <Text
                    x="500"
                    y="200"
                    fill={COLORS.gray}
                    fontSize="70"
                    textAnchor="end"
                >
                    {`${temperature.toFixed(1)}°C`}
                </Text>

                {/* Graph / Gauge Area */}
                <Polyline
                    points="48,337 652,337"
                    fill="none"
                    stroke={COLORS.gray}
                    strokeWidth="1"
                />
                <Polyline
                    points="48,342 48,293 249,293 249,342 249,293 450,293 450,342 450,293 652,293 652,342"
                    fill="none"
                    stroke={COLORS.gray}
                    strokeWidth="1"
                />

                {/* Power Bars full width = 600 */}
                <Rect x="50" y="295" width={Math.min(600,(power / 3000 * 600))} height="40" fill="gold" />

                {/* X-Axis Labels */}
                <Text x="48" y="360" fill={COLORS.gray} fontSize="16" textAnchor="middle">0</Text>
                <Text x="249" y="360" fill={COLORS.gray} fontSize="16" textAnchor="middle">1000 W</Text>
                <Text x="450" y="360" fill={COLORS.gray} fontSize="16" textAnchor="middle">2000 W</Text>
                <Text x="652" y="360" fill={COLORS.gray} fontSize="16" textAnchor="middle">3000 W</Text>

                {/* Heating Power Label */}
                <Text x="350" y="385" fill={COLORS.gray} fontSize="16" textAnchor="middle">
                    {`Heizleistung ${power} W`}
                </Text>

                {/* Water Tank Icon */}
                <G transform="translate(570,110)">
                    <Rect
                        x="23"
                        y="2"
                        width="41.45"
                        height="69.5"
                        rx="8"
                        ry="10"
                        fill="url(#grad1)"
                        stroke={COLORS.white}
                        strokeWidth="2.2"
                    />
                </G>

                {/* Wifi Status */}
                <G transform="translate(650,7) scale(7 7)">
                    <Circle cx="2.45" cy="4.2" r="0.24" fill={isConnected ? COLORS.green : COLORS.red} stroke={isConnected ? "lime" : "darkred"} strokeWidth="0.57" />
                    <Path
                        d="M77.41,32.83a1.89,1.89,0,0,1,1-.26,2,2,0,0,1,1,.26"
                        transform="translate(-76 -29.8)"
                        fill="none"
                        stroke={isConnected ? COLORS.green : COLORS.red}
                        strokeLinecap="round"
                        strokeWidth="0.72"
                    />
                    <Path
                        d="M76.8,31.79a3.2,3.2,0,0,1,1.56-.42,3.14,3.14,0,0,1,1.56.42"
                        transform="translate(-76 -29.8)"
                        fill="none"
                        stroke={isConnected ? COLORS.green : COLORS.red}
                        strokeLinecap="round"
                        strokeWidth="0.72"
                    />
                </G>
            </Svg>

            {/* 2. SEPARATE PRESSABLE BOOST BUTTON */}
            {/* Position Logic:
         Main Canvas: 700x400
         Original Group Translate: 563, 203
         Inner Rect: x=7, y=9, w=80, h=48
         
         Calculated Absolute Position:
         Left: (563 + 7) / 700 = 81.42%
         Top: (203 + 9) / 400 = 53%
         Width: 80 / 700 = 11.42%
         Height: 48 / 400 = 12%
      */}
            <TouchableOpacity
                style={styles.boostButton}
                onPress={handleBoost}
                activeOpacity={0.7}
            >
                <Svg width="100%" height="100%" viewBox="7 9 80 48">
                    <Rect
                        x="7"
                        y="9"
                        width="80"
                        height="48"
                        fill={boostactive == 2? COLORS.green: COLORS.blue}
                    />
                    <Path
                        d="M49 48c-9,-10 7,-19 -1,-30l-5 0c9,10 -7,20 1,30l5 0z"
                        fill={COLORS.white}
                        stroke={COLORS.white}
                        strokeWidth="1.3"
                    />
                    <Path
                        d="M61 48c-9,-10 7,-19 -1,-30l-5 0c9,10 -7,20 1,30l5 0z"
                        fill={COLORS.white}
                        stroke={COLORS.white}
                        strokeWidth="1.3"
                    />
                    <Path
                        d="M37 48c-9,-10 7,-19 -1,-30l-5 0c9,10 -7,20 1,30l5 0z"
                        fill={COLORS.white}
                        stroke={COLORS.white}
                        strokeWidth="1.3"
                    />
                </Svg>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 700 / 400,
        backgroundColor: '#fff',
        position: 'relative', // Necessary for absolute children
    },
    boostButton: {
        position: 'absolute',
        left: '81.4%',
        top: '53%',
        width: '11.4%',
        height: '12%',
        // Optional: Add shadow or elevation here since it's now a native View
    }
});

export default ActhorGauge;