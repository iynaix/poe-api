import Image from "next/image"
import { truncateFloat } from "../utils"

export const CHAOS_ICON = "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png"

export const DIVINE_ICON = "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyModValues.png"

type PoeIconProps = {
    icon: string
    alt: string
    className?: string
    size: number
}

// const whClassName = (size: number) => `h-[${size}px] w-[${size}px]`

const PoeIcon = ({ icon, alt, className, size }: PoeIconProps) => {
    const whClassName = `h-[${size}px] w-[${size}px]`

    return (
        <Image
            src={icon.replace(/\?.*$/, "")}
            alt={alt}
            className={`inline-block ${whClassName} ${className}`}
            width={size}
            height={size}
        />
    )
}

export default PoeIcon

export const ChaosIcon = (props: Omit<PoeIconProps, "icon" | "alt">) => {
    return <PoeIcon {...props} icon={CHAOS_ICON} alt="Chaos Orb" />
}

export const DivineIcon = (props: Omit<PoeIconProps, "icon" | "alt">) => {
    return <PoeIcon {...props} icon={DIVINE_ICON} alt="Divine Orb" />
}

type PriceTextProps = {
    className?: string
    amount: number
    size: number
    places?: number
}

export const DivinePrice = ({ className, size, amount, places = 3 }: PriceTextProps) => {
    return (
        <div className={`flex items-center ${className}`}>
            <span style={{ fontSize: size }}>{truncateFloat(amount, places)}&nbsp;</span>
            <DivineIcon size={Math.floor(size)} />
        </div>
    )
}

export const ChaosPrice = ({ className, size, amount, places = 3 }: PriceTextProps) => {
    return (
        <div className={`flex items-center ${className}`}>
            <span style={{ fontSize: size }}>{truncateFloat(amount, places)}&nbsp;</span>
            <ChaosIcon size={Math.floor(size)} />
        </div>
    )
}
