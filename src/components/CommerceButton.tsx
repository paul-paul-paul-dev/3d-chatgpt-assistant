import { Button } from "@coconut-xr/kruemel";
import { CommerceButtonType, getCommerButtonTypeName } from "../states/AppState";
import Card from "../objects/Card";

type CommerceButtonProps = {
  commerceButtonType: CommerceButtonType;
};

export default function CommerceButton(props: JSX.IntrinsicElements["mesh"] & CommerceButtonProps) {

  const handleClick = () => {
    console.log("Click!")
  }


  return (
    <Card radius={10} ratio={2} flexDirection="row" justifyContent="center" hoverHeight={0.2} padding={0} alignItems="center">
      <Button
        fontSize={0.3}
        paddingX={0.7}
        paddingY={0.2}
        onClick={handleClick}
        backgroundColor={
          props.commerceButtonType === CommerceButtonType.BUY
            ? "lime"
            : props.commerceButtonType === CommerceButtonType.SELL
            ? "red"
            : "black"
        }
        color={props.commerceButtonType === CommerceButtonType.SELL ? "white" : "black"}
      >{`${getCommerButtonTypeName(props.commerceButtonType)}`}</Button>
    </Card>
  );
}
