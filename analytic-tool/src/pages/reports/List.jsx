import { useState } from "react";
import { useQuery } from "react-query";
import { reportListFetch } from "../../utils/api";
import { Box, Paper, Divider, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Typography } from "@mui/material";
import { localUserReadableDateFormat } from "../../utils/utils";


export function ReportList() {
    const { data: reports, isLoading, error } = useQuery('reportlist', () => reportListFetch())
    
    console.log(reports)

    return (
        <Box>
            <Typography variant="h5">Hesabatların siyahısı</Typography>
            <Divider />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Adı</TableCell>
                            <TableCell>Qovluq</TableCell>
                            <TableCell>İşləmə tezliyi</TableCell>
                            <TableCell>Yaranma tarixi</TableCell>
                            <TableCell>Yenilənmə tarixi</TableCell>
                            <TableCell>Sonuncu icra tarixi</TableCell>
                            <TableCell>Əməliyyatlar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports?.map((report) => (
                            <TableRow
                                key={report.id}
                                sx={{ '&:last-child TableRow, &:last-child th': { border: 0 } }}
                            >
                                    <TableCell>{report['id']}</TableCell>
                                    <TableCell>{report['name']}</TableCell>
                                    <TableCell>{report['folder']}</TableCell>
                                    <TableCell>{report['cron']}</TableCell>
                                    <TableCell>{localUserReadableDateFormat(report['created_at'])}</TableCell>
                                    <TableCell>{localUserReadableDateFormat(report['query_created'])}</TableCell>
                                    <TableCell>{localUserReadableDateFormat(report['last_file'])}</TableCell>
                                    <TableCell>
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}