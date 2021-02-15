import { useStyle } from "./hooks/useStyle"
import Button, { ButtonProps } from "./Button"
import { forwardRef } from "react"

const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(function IconButton({ children, className, ...props }: ButtonProps, ref) {
    const s = useStyle()
    return (
        <Button className={s('icon', { className })} ref={ref} {...props}>
            {children}
        </Button>
    )
})

export default IconButton
