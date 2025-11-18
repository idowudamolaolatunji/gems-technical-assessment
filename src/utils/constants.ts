
// LOCALSTORAGE KEYS 
export const STORAGE_KEYS = {
    USERS: 'app_users',
    CURRENT_USER: 'current_user',
} as const;

// ACCOUNT SESSION DURATION IN MILLISECONDS (30 SECS)
export const SESSION_DURATION = 30 * 60 * 1000;

export const BASE_COLORS = {
    brand_primary: "#9A1725",
    text_primary: "#252D3C",
    text_secondary: "#344054",
    background_light: "#F9F9FA",
    border_stroke: "#CDD0D5",
    white: "#ffffff",
}

export const CUSTOM_TABLE_STYLES = {
    table: {
        style: {
            fontFamily: "inherit",
            color: "inherit",
            scrollbarWidth: "none",
            overflow: "hidden",
        },
    },
    head: {
        style: {
            fontSize: "1.35rem",
            fontWeight: "500",
            height: "3.5rem",
            textTransform: "capitalize",
        },
    },
    rows: {
        style: {
            minHeight: "4rem",
            fontWeight: 500,
            color: `${BASE_COLORS.text_secondary}`,
        },
    },
    headCells: {
        style: {
            paddingRight: '0.5rem',
            backgroundColor: `${BASE_COLORS.background_light}`,
            color: `${BASE_COLORS.text_secondary}`,
            height: "3.5rem",
            borderTop: `1px solid ${BASE_COLORS.border_stroke}`,
            borderBottom: `1px solid ${BASE_COLORS.border_stroke}`,
        },
    },
    cells: {
        style: {
            fontSize: "1.2rem",
            fontWeight: "500",
            textAlign: 'center',
            backgroundColor: `${BASE_COLORS.white}`,
            scrollbarWidth: "none",
        }
    },
};