import {
  Canvas,
  Circle,
  Fill,
  Skia,
  Text,
  add,
  useValue,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import { useWindowDimensions } from "react-native";
import {
  SensorType,
  clamp,
  useAnimatedSensor,
  useDerivedValue,
  useFrameCallback,
} from "react-native-reanimated";

const R = 55;
const BALL_WALL_ELASTICITY = 0.7;

const colors = ["#dafb61", "#61DAFB", "#fb61da", "#61fbcf"].map((c) =>
  Skia.Color(c)
);

export const BallsToy = () => {
  const gravity = useAnimatedSensor(SensorType.GRAVITY);

  const { width, height } = useWindowDimensions();

  /** The center of the canvas. */
  const center = vec(width / 2, height / 2);

  /** Ball velocity. */
  const v = useValue(vec(0, 0));

  /** Ball's center position. */
  const c = useValue(center);

  useFrameCallback((frame) => {
    const dt = frame.timeSincePreviousFrame;
    if (!dt) return;

    // bounce off bottom and top walls
    if (
      (v.current.y > 0 && c.current.y + R >= height) ||
      (v.current.y < 0 && c.current.y - R <= 0)
    ) {
      v.current = vec(v.current.x, -v.current.y * BALL_WALL_ELASTICITY);
    }

    // bounce off left and right walls
    if (
      (v.current.x > 0 && c.current.x + R >= width) ||
      (v.current.x < 0 && c.current.x - R <= 0)
    ) {
      v.current = vec(-v.current.x * BALL_WALL_ELASTICITY, v.current.y);
    }

    // apply gravity based on device's rotation
    v.current = add(
      v.current,
      vec(
        gravity.sensor.value.x * 0.001 * dt,
        -gravity.sensor.value.y * 0.001 * dt
      )
    );

    // update the ball's position based on velocity
    c.current = vec(
      clamp(c.current.x + v.current.x * dt, R, width - R),
      clamp(c.current.y + v.current.y * dt, R, height - R)
    );
  });

  /** The current gravity components as text. */
  const gravityText = useDerivedValue(
    () =>
      [
        `x: ${gravity.sensor.value.x.toFixed(2)}`,
        `y: ${gravity.sensor.value.y.toFixed(2)}`,
        `z: ${gravity.sensor.value.z.toFixed(2)}`,
      ].join("\n"),
    [gravity.sensor.value]
  );

  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color={colors[0]}></Fill>
      <Text x={20} y={100} text={gravityText} />
      <Circle c={c} r={R} color={colors[2]} />
    </Canvas>
  );
};
