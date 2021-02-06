import { useStyle } from "./hooks/useStyle"
import Button, { ButtonProps } from "./Button"

export default function IconButton({ children, className, ...props }: ButtonProps) {
    const s = useStyle()
    return (
        <Button className={s('icon', { className })} {...props}>
            {children}
        </Button>
    )
}
