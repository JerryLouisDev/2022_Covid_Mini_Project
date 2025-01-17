import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTable } from 'react-table';
import { DeleteButton } from '../components/buttons';
import api from '../api';

import MaUTable from '@material-ui/core/Table';
import { CssBaseline, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 0 40px 40px 40px;

  @media screen and (max-width: 420px) {
    padding-left: 0.5em;
    padding-right: 0.5em;
  }
`;


const Table = ({ columns, data }) => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <MaUTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <TableCell {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow data-row-item-id={row.values._id} {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </MaUTable>
  );
};

class Exams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
    };
  }

  componentDidMount() {
    console.log('ItemsList: props');
    console.log(this.props);

    this.fetchAllItems();
  }

  fetchAllItems = () => {
    api
      .getAllItems()
      .then(resp => {
        const { items } = resp.data;
        console.log('getAllItems: resp');
        console.log(items);
        this.setState({ items });
      })
      .catch(err => {
        console.error(`ERROR in 'getAllItems': ${err}`);
        console.error(err);
        return err;
      });
  };

  deleteSingleItem = itemId => {
    return api
      .deleteItemById(itemId)
      .then(resp => {
        console.log('deleteItemById: resp');
        console.log(resp);
        return resp;
      })
      .catch(err => {
        console.error(`ERROR in 'deleteSingleItem': ${err}`);
        console.error(err);
        return err;
      });
  };

  handleRemoveItem = data => {
    const itemId = data;

    this.deleteSingleItem(itemId).then(resp => {
      console.log('handleRemoveItem: resp');
      console.log(resp);
      this.fetchAllItems();
    });
  };

  render() {
    const items = this.state.items || {};
    console.log(items);

    const columns = [
      {
        Header: 'Patient ID',
        accessor: 'patient_Id',
        // filterable: true,
        Cell: props => {
          console.log(props);
          const { original } = props.cell.row;
          return <span data-item-id={original.patient_Id}>{props.value}</span>;
        },
      },
      {
        Header: 'Exam',
        accessor: 'exam_Id',
        // filterable: true,
        Cell: props => {
          const { original } = props.cell.row;
          return <span data-name={original.exam_Id}>{props.value}</span>;
        },
      },
      {
      Header: 'Image',
      accessor: 'png_filename',
      // filterable: true,
      Cell: props => {
          const imgUrl= `https://ohif-hack-diversity-covid.s3.amazonaws.com/covid-png/`
          const { original } = props.cell.row;
          //const imageUrl = () => `https://ohif-hack-diversity-covid.s3.amazonaws.com/covid-png/${png_filename}`;
          return <img data-name={original.png_filename} style={{width: 60, borderRadius: 40/ 2}} src={imgUrl+props.value} />
        },
      },
      {
      Header: 'Key Findings',
      accessor: 'key_findings',
      Cell: props => {
          const { original } = props.cell.row;
          return <span data-timeframe={original.key_findings}>{props.value || '-'}</span>;
        },
      },
      /*{
        Header: 'Priority',
        accessor: 'priority',
        // filterable: true,
        Cell: props => {
          const { original } = props.cell.row;
          return <span data-priority={original.priority}>{props.value}</span>;
        },
      },*/
      {
        Header: 'Update',
        accessor: '_update',
        Cell: props => {
          const { original } = props.cell.row;

          return (
            <Link data-update-id={original._id} to={`/item/update/${original._id}`}>
              Update
            </Link>
          );
        },
      },
      {
        Header: 'Delete',
        accessor: '_delete',
        Cell: props => {
          const { original } = props.cell.row;
          return (
            <span data-delete-id={original._id}>
              <DeleteButton id={original._id} onDelete={this.handleRemoveItem} />
            </span>
          );
        },
      },
    ];

    return (
      <Wrapper>
        <CssBaseline />
        {(items || []).length > 0 ? (
          <Table data={items} columns={columns} />
        ) : (
          `No items to render... :(`
        )}
      </Wrapper>
    );
  }
}

export default Exams;
