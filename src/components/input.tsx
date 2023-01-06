import classNames from "classnames"
import React from "react"

type InputProps = {
    name: string
    className?: string
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void
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

const Input = ({ name, className, type = "text", value, onChange }: InputProps) => {
    return (
        <input
            className={classNames(
                "text-gray-850 block w-20 rounded-md shadow-sm bg-gray-100 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                className
            )}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            {...(type === "number" ? { min: 0 } : {})}
            min={0}
        />
    )
}

export default Input
