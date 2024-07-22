/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - correctly format currency unit in Y axis
    - use a custom tooltip so that currency can be rendered correctly
    - improve readability (contrast) of total sales in dark mode

    NB: Errors about defaultProps will be thrown by e.g. XAxis
    This is an issue with current version of recharts that has no actual impact.
*/

import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";
import { formatCurrency } from "../../utils/helpers";
import {
    eachDayOfInterval,
    format,
    isDate,
    isSameDay,
    subDays,
} from "date-fns";

const StyledSalesChart = styled(DashboardBox)`
    grid-column: 1 / -1;

    /* Hack to change grid line colors */
    & .recharts-cartesian-grid-horizontal line,
    & .recharts-cartesian-grid-vertical line {
        stroke: var(--color-grey-300);
    }
`;

const StyledCustomTooltip = styled.div`
    display: flexbox;
    flex-direction: column;
    padding: 1.2rem;
    border-radius: 20%;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.$backgroundColor || "transparent"};
    border: 1px solid ${(props) => props.$borderColor || "black"};
`;

export default function SalesChart({ bookings, numDays }) {
    const { isDarkMode } = useDarkMode();

    const allDates = eachDayOfInterval({
        start: subDays(new Date(), numDays - 1),
        end: new Date(),
    });

    const data = allDates.map((date) => {
        return {
            label: format(date, "MMM dd"),
            totalSales: bookings
                .filter((booking) =>
                    isSameDay(date, new Date(booking.created_at))
                )
                .reduce((acc, cur) => acc + cur.totalPrice, 0),
            extrasSales: bookings
                .filter((booking) =>
                    isSameDay(date, new Date(booking.created_at))
                )
                .reduce((acc, cur) => acc + cur.extrasPrice, 0),
        };
    });

    const colors = isDarkMode
        ? {
              totalSales: { stroke: "#6b65dd", fill: "#4f46e5" },
              extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
              text: "#e5e7eb",
              background: "#18212f",
          }
        : {
              totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
              extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
              text: "#374151",
              background: "#fff",
          };

    function currencyTickFormatter(tickValue) {
        return formatCurrency(tickValue, false);
    }

    function CustomTooltip({
        payload,
        label,
        active,
        backgroundColor,
        borderColor,
    }) {
        if (active) {
            return (
                <StyledCustomTooltip
                    $backgroundColor={backgroundColor}
                    $borderColor={borderColor}
                >
                    <p>{label}</p>
                    <p style={{ color: payload[0].stroke }}>
                        {payload[0].name}: {formatCurrency(payload[0].value)}
                    </p>

                    <p style={{ color: payload[1].stroke }}>
                        {payload[1].name}: {formatCurrency(payload[1].value)}
                    </p>
                </StyledCustomTooltip>
            );
        }

        return null;
    }

    return (
        <StyledSalesChart>
            <Heading as="h2">
                Sales from {format(allDates.at(0), "dd MMM yyyy")} &mdash;{" "}
                {format(allDates.at(-1), "dd MMM yyyy")}
            </Heading>

            <ResponsiveContainer height={300} width="100%">
                <AreaChart data={data}>
                    <XAxis
                        dataKey="label"
                        tick={{ fill: colors.text }}
                        tickLine={{ stroke: colors.text }}
                    />
                    <YAxis
                        tick={{ fill: colors.text }}
                        tickLine={{ stroke: colors.text }}
                        tickFormatter={currencyTickFormatter}
                    />
                    <Tooltip
                        content={
                            <CustomTooltip
                                backgroundColor={colors.background}
                                borderColor={colors.text}
                            />
                        }
                    />
                    <CartesianGrid strokeDasharray="4" />
                    <Area
                        dataKey="totalSales"
                        type="monotone"
                        stroke={colors.totalSales.stroke}
                        fill={colors.totalSales.fill}
                        strokeWidth={2}
                        name="Total sales"
                    />
                    <Area
                        dataKey="extrasSales"
                        type="monotone"
                        stroke={colors.extrasSales.stroke}
                        fill={colors.extrasSales.fill}
                        strokeWidth={2}
                        name="Extras sales"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </StyledSalesChart>
    );
}
