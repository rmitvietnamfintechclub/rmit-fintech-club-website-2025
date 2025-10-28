import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

// This interface is updated. `onPageChange` now expects a function that only takes a number.
interface PaginationRoundedProps {
    page: number;
    onPageChange: (value: number) => void;
    count: number;
}

export default function PaginationRounded({
    page,
    onPageChange,
    count,
}: PaginationRoundedProps) {
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        onPageChange(value);
    };

    return (
        <Stack
            spacing={2}
            className="bg-[#F7D27F] p-2 mb-8 rounded-lg text-[#2C305F] font-bold"
        >
            <Pagination
                count={count}
                page={page}
                // Use the local handleChange function here
                onChange={handleChange}
                variant="outlined"
                shape="rounded"
                siblingCount={0}
                boundaryCount={1}
                sx={{
                    // ... your sx styles remain the same
                    "& .MuiPaginationItem-root": {
                        color: "#2C305F",
                        borderColor: "#F7D27F",
                        borderRadius: "8px",
                        margin: "0 8px",
                        "&:hover": {
                            backgroundColor: "#FFEFCA",
                        },
                    },
                    "& .Mui-selected": {
                        backgroundColor: "#2C305F",
                        color: "white",
                        boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                            backgroundColor: "#2C305F",
                        },
                    },
                    "& .MuiPaginationItem-ellipsis": {
                        margin: "0 8px",
                    },
                }}
            />
        </Stack>
    );
}