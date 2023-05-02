import { Container, Text } from "@coconut-xr/koestlich";
import { CommerceButtonType, getCommerButtonTypeName, useAppStore } from "../states/AppState";
import { Button } from "@coconut-xr/kruemel";
import CommerceButton from "./CommerceButton";
import { useMemo } from "react";
import CardMesh from "../objects/CardMesh";
import Card from "../objects/Card";

export default function Ticker(props: JSX.IntrinsicElements["mesh"]) {
  const [stock, commerceButton] = useAppStore((appStore) => [
    appStore.stock,
    appStore.commerceButton,
  ]);

  return (
    <Container
      flexGrow={3}
      margin={0.2}
      backgroundColor="white"
      borderRadius={0.2}
      flexDirection="row"
    >
      <Container flexGrow={2} margin={0.2} backgroundColor="white">
        {stock ? (
          <Card radius={10} ratio={2} flexDirection="column" flexGrow={1} color={"lightgray"}>
            <Text fontSize={0.3}>{`${stock.companyName} (${stock.tickerSymbol})`}</Text>
            <Container flexDirection="row" marginY={"auto"}>
              <Text fontSize={0.35}>{`${stock.currentPrice} Euro`}</Text>
              <Text fontSize={0.35} color={"green"}>
                {" ^^"}
              </Text>
            </Container>
          </Card>
        ) : (
          <Text fontSize={0.25}>No Stock</Text>
        )}
      </Container>
      <Container flexGrow={4} margin={0.2} backgroundColor="white" />
      <Container
        flexGrow={2}
        margin={0.2}
        backgroundColor="white"
        justifyContent="center"
        alignItems="center"
      >
        {commerceButton !== CommerceButtonType.NONE ? (
          <CommerceButton commerceButtonType={commerceButton} />
        ) : (
          <Text fontSize={0.25}>Ask to buy or sell a stock!</Text>
        )}
      </Container>
    </Container>
  );
}
