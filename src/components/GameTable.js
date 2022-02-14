import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { BsExclamationCircle } from "react-icons/bs";

const columns = [
    { id: 'boximageurl', label: 'Box', align: 'center', disablePadding: true, minWidth: 75, maxWidth: 200 },
    { id: 'title', label: 'Game Title', align: 'center', disablePadding: true, minWidth: 150 },
    { id: 'developer', label: 'Developer', align: 'center', disablePadding: true, minWidth: 150 },
    { id: 'publisher', label: 'Publisher', align: 'center', disablePadding: true, minWidth: 150 },
    { id: 'releasedate', label: 'Release Date', align: 'center', disablePadding: true, minWidth: 150 },
    { id: 'actions', label: 'Actions', align: 'center', disablePadding: true, minWidth: 100, }
  ];

function GameTable(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [search, setSearch] = React.useState('');
    const [onlyOwned, setOnlyOwned] = React.useState(false);
    const [onlyUnowned, setOnlyUnowned] = React.useState(false);
    const [sort, setSort] = React.useState('releaseDate');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setSearch(event.target.value);
    };

    const handleFilter = (event) => {
        if(event.target.id === 'onlyOwned') {
            setOnlyOwned(!onlyOwned);
            return;
        }
        if(event.target.id === 'onlyUnowned') {
            setOnlyUnowned(!onlyUnowned);
        }   
    };

    const handleSort = (event) => {
        event.preventDefault();
        setSort(event.target.value);
    };

    function getData() {
        let filteredData = props.data;
        if(onlyOwned) {
            filteredData = filteredData.filter(row => row.owned === 'Yes')
        } 
        if (onlyUnowned) {
            filteredData = filteredData.filter(row => row.owned === 'No')
        }
        if(search !== '') {
            filteredData = filteredData.filter((row) => 
            row.title.toLowerCase().includes(search.toLowerCase()) || row.developer.toLowerCase().includes(search.toLowerCase())
            || row.publisher.toLowerCase().includes(search.toLowerCase()) || row.releasedate.toLowerCase().includes(search.toLowerCase()))
        }
        if(sort === 'gameTitle') {
            filteredData = filteredData.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
        } else if(sort === 'developer') {
            filteredData = filteredData.sort((a,b) => (a.developer > b.developer) ? 1 : ((b.developer > a.developer) ? -1 : 0))
        } else if(sort === 'publisher') {
            filteredData = filteredData.sort((a,b) => (a.publisher > b.publisher) ? 1 : ((b.publisher > a.publisher) ? -1 : 0))
        } else if(sort === 'releaseDate') {
            filteredData = filteredData.sort((a,b) => new Date(a.releasedate) - new Date(b.releasedate))
        }
        return filteredData;
    }

    return (
        <>
            <label htmlFor="search">
                {"Search: "}
                <input id="search" type="text" onChange={handleSearch} />
            </label>
            <label htmlFor="onlyOwned">
                Only Owned
                <input id="onlyOwned" type="checkbox" onChange={handleFilter} />
            </label>
            <label htmlFor="onlyUnowned">
                Only Unowned
                <input id="onlyUnowned" type="checkbox" onChange={handleFilter} />
            </label>
            <label htmlFor="sort">
                {"Sort By: "}
                <select id="sortBy" name="sortBy" onChange={handleSort} defaultValue={"releaseDate"}>
                    <option value="gameTitle">Game Title</option>
                    <option value="developer">Developer</option>
                    <option value="publisher">Publisher</option>
                    <option value="releaseDate">Release Date</option>
                </select>
            </label>
        
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: '80vh' }}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        >
                        {column.label}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getData()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(row => {
                        return (
                        <TableRow 
                            className={row.owned === "Yes" ? "ownedRow" : "unownedRow"}
                            hover role="checkbox" tabIndex={-1} key={row.id}
                            >
                            
                            {columns.map((column) => {
                            const value = row[column.id];
                            return (
                                <TableCell key={column.id} align={column.align} padding={column.disablePadding ? 'none' : 'normal'}>
                                    {column.id === "boximageurl" ? value === "unknown" ? <BsExclamationCircle /> : <div dangerouslySetInnerHTML={{ __html: "<img src='" + value + "' height='50px' />"}} /> : ""}
                                    {column.id === "title" ? row["gamevaluenowurl"] === "unknown" ? value : <div dangerouslySetInnerHTML={{ __html: "<a href='" + row["gamevaluenowurl"] + "' target='_blank'>" + value + "</a>"}} /> : ""}
                                    {column.id === "developer" ? value : ""}
                                    {column.id === "publisher" ? value : ""}
                                    {column.id === "releasedate" ? value : ""}
                                    {column.id === "dateOwned" ? value : ""}
                                </TableCell>
                            );
                            })}
                        </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 100, {label: 'All', value: -1}]}
                component="div"
                count={getData().length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Paper>
        </>
    );
}

export default GameTable;