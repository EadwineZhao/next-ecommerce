import { BounceLoader } from "react-spinners"

export default function Spinner() {
    return (
        <BounceLoader 
            color="#1f398a"
        speedMultiplier={2}
        />
    )
}