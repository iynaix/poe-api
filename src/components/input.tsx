import classNames from "classnames"
import React from "react"

type InputProps = {
    name: string
    className?: string
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void
    min?: number
} & (
    | {
          type: "number"
          value: number
      }
    | {
          type: "text"
          value: string
      }
)

const Input = ({ name, className, type = "text", value, onChange, min }: InputProps) => {
    return (
        <input
            className={classNames(
                "block w-20 rounded-md border-surface1 bg-surface1 text-text shadow-sm focus:border-sapphire focus:ring-sapphire sm:text-sm",
                className
            )}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            min={min}
        />
    )
}

export default Input
