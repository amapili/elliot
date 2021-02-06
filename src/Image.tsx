import { ComponentProps, ReactNode, useState, useRef } from 'react'
import LoadingFade from "./LoadingFade"
import { useStyle } from './hooks/useStyle'
import useIsomorphicEffect from './hooks/useIsomorphicEffect'

export interface ImageProps extends ComponentProps<'div'> {
    loading?: boolean
    src?: string
    tag?: ReactNode
    alt?: string
}

export default function Image({ loading, src, tag, className, children, alt, ...rest }: ImageProps) {
    const s = useStyle(),
        [{ loaded: imgLoaded, error }, setImgLoaded] = useState({ loaded: !src, error: !src }),
        loaded = !loading && (error || imgLoaded),
        img = useRef<HTMLImageElement>(null)
    useIsomorphicEffect(() => {
        const i = img.current
        if (!src || !i)
            setImgLoaded({ loaded: !src, error: !src })
        else
            setImgLoaded({ loaded: i.naturalWidth !== 0, error: false })
    }, [src])
    return (
        <div className={s('image', { className })} {...rest}>
            {loaded ? null : <LoadingFade />}
            {src && !error ? <img onLoad={() => setImgLoaded({ loaded: true, error: false })} onError={() => setImgLoaded({ loaded: true, error: true })} src={src} ref={img} alt={alt} /> : loaded ? <div className={s.color} /> : null}
            {tag && loaded && <div className={s.tag}>{tag}</div>}
            {children}
        </div>
    )
}
