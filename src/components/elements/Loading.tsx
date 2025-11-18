import { LineSpinner } from 'ldrs/react'
import 'ldrs/react/LineSpinner.css'
import { BASE_COLORS } from '../../utils/constants'

export function AppLoader() {
    return (
        <div className='spinner--container'>
            <LineSpinner
                size="40"
                stroke="3"
                speed="1"
                color={BASE_COLORS.brand_primary}
            />
        </div>
    )
}

export function Loader({ size, color }: { size?: number, color?: string }) {
    return (
        <LineSpinner
            size={size ? size : 20}
            stroke="1.25"
            speed="1"
            color={color || BASE_COLORS.brand_primary}
        />
    )
}
