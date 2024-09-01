import React, { useContext, useEffect, useRef, useState } from 'react';
import { TextField, Box, Button, Grid2 as Grid, Paper, styled, Typography, Divider, Select, MenuItem, FormControl, InputLabel, FormControlLabel, FormHelperText, Autocomplete, Checkbox } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { sql } from '@codemirror/lang-sql';
import ReactCodeMirror, { useCodeMirror } from '@uiw/react-codemirror';
import { useQuery } from 'react-query';

import { Check, CheckBox, CheckBoxOutlineBlank, Folder, PlayArrowSharp, Save, SaveAsRounded } from '@mui/icons-material';
import { folderListFetch, dbListFetch, cronListFetch, catchAsync } from '../../utils/api';
import { UiContext } from '../../store/context/store';
import { Endpoint } from '../../utils/endpoint';
import { services } from '../../config/services';
import * as _ from 'lodash'
import { useNavigate } from 'react-router';

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  })
}));

const ReportForm = (props) => {
  const navigate = useNavigate()
  const { data: folders, isLoading, error } = useQuery('folderListFetch', () => folderListFetch());
  const { data: db, isLoading: dbLoading, error: dbError } = useQuery('dbListFetch', () => dbListFetch());
  const { data: cron, isLoading: cronLoading, error: cronError } = useQuery('cronListFetch', () => cronListFetch());
  const uiContext = useContext(UiContext);
  // console.log(db)
  const reportForm = useRef(null);
  const [reportResult, setReportResult] = useState(null);
  const [sqlQuery, setSqlQuery] = useState('');
  const [params, setParams] = useState([]);
  const [filters, setFilters] = useState([])
  const step = useRef(0)

  useEffect(() => {
    setParams(() => sqlQuery.match(/\{@.*?@\}/gmi) ?? []);
    return () => [];
  }, [sqlQuery])

  if (isLoading) {
    return <h1>Loading ....</h1>;
  }

  if (error) {
    return <p className="error">{error.message}</p>;
  }

  const { report } = props;


  return (
    <Box ref={reportForm} component="form">
      <Typography variant='h6' margin={3}>Hesabat barədə məlumatlar</Typography>
      <Divider variant='middle' />
      <Box display="flex">
        <Grid onSubmit={(e) => {
          e.preventDefault();
        }} margin={2} container spacing={2} size={reportResult ? 6 : 12}>
          <Grid size={4}>
            <Item>
              <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth size="small">
                <TextField
                  fullWidth
                  name='name'
                  size='small'
                  label='Hesabatın adı'
                  helperText='Hesabatın adını daxil edin'
                  value={report?.name}
                  required
                />
              </FormControl>
            </Item>
          </Grid>

          <Grid size={4}>
            <Item>
              <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth size="small">
                <TextField
                  fullWidth
                  name='report_table'
                  size='small'
                  label='Hesabatın cədvəlinin adı'
                  helperText='Hesabat cədvəlinin adını daxil edin'
                  value={report?.report_table}
                  required
                />
              </FormControl>
            </Item>
          </Grid>

          <Grid size={4}>
            <Item>
              <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth size="small">
                <InputLabel id="report-folder-label">Qovluq</InputLabel>
                <Select
                  name='report_folder'
                  labelId="report-folder-label"
                  id="report_folder"
                  label="Qovluq"
                  defaultValue=""
                  placeholder='Qovluq'
                  fullWidth
                  value={report?.folder_id}
                  size='small'
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {folders?.map(folder =>
                    <MenuItem key={folder.folder_id} value={folder.folder_id} style={{ display: 'flex', alignItems: 'center' }}>
                      <Box display='flex'>
                        <Folder color='warning' style={{ width: '22px', height: '22px', marginLeft: (folder.level - 1.5) + 'rem' }} />
                        <Typography style={{ marginLeft: '5px' }}>{folder.folder_name}</Typography>
                      </Box>
                    </MenuItem>
                  )}
                </Select>
                <FormHelperText>Hesabatın yerləşdiyi qovluğu seçin</FormHelperText>
              </FormControl>
            </Item>
          </Grid>

          <Grid size={6}>
            <Item>
              <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth size="small">
                <InputLabel id="report-db-label">Baza</InputLabel>
                <Select
                  labelId="report-db-label"
                  name="database"
                  label="Baza"
                  defaultValue=""
                  placeholder='Baza'
                  fullWidth
                  value={report?.folder_id}
                  size='small'
                  required
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {db?.map(d =>
                    <MenuItem key={d} value={d} style={{ display: 'flex', alignItems: 'center' }}>
                      <Box display='flex'>
                        <Typography style={{ marginLeft: '5px' }}>{d}</Typography>
                      </Box>
                    </MenuItem>
                  )}
                </Select>
                <FormHelperText>Hesabatın icra ediləcəyi bazanı seçin</FormHelperText>
              </FormControl>
            </Item>
          </Grid>

          <Grid size={6}>
            <Item>
              <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth size="small">
                <InputLabel id="report-cron-label">İşləmə tezliyi</InputLabel>
                <Select
                  labelId="report-cron-label"
                  name='cron_job'
                  id="cron_job"
                  label="İşləmə tezliyi"
                  defaultValue=""
                  placeholder='İşləmə tezliyi'
                  fullWidth
                  value={report?.cron_job}
                  size='small'
                  required
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {cron?.map((d, k) =>
                    <MenuItem key={k} value={d.id} style={{ display: 'flex', alignItems: 'center' }}>
                      <Box display='flex'>
                        <Typography style={{ marginLeft: '5px' }}>{d.title}</Typography>
                      </Box>
                    </MenuItem>
                  )}
                </Select>
                <FormHelperText>Hesabatın icra edilmə tezliyini seçin</FormHelperText>
              </FormControl>
            </Item>
          </Grid>

          <Grid size={9}>
            <Item>
              <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth size="small">
                <Typography>SQL</Typography>
                <Divider />
                <ReactCodeMirror onChange={e => setSqlQuery(e)} value={report?.sql} height='300px' extensions={[sql()]} />
                <FormHelperText>Hesabatın sorğusu</FormHelperText>
              </FormControl>
            </Item>
          </Grid>

          {params.length > 0 && (
            <Grid size={3}>
              <Typography>Parametrlər</Typography>
              {params.map((param, key) => <Grid key={key} size={3}>
                <Item>
                  <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth size="small">
                    <TextField
                      fullWidth
                      name={'param[' + key + ']'}
                      size='small'
                      label={param.replace(/\{@(.*?)@\}/gmi, "$1")}
                      value={report?.report_table}
                      required
                    />
                  </FormControl>
                </Item>
              </Grid>)}
            </Grid>
          )}

          <Grid size={12}>
            <Box display="flex" justifyContent="end">
              <Button type='button' onClick={() => saveReport(reportForm.current, sqlQuery, params, step.current, uiContext).then(data => {
                setReportResult(data.data)
                step.current += 1;
              })} size='small' variant="contained" color="success">
                <PlayArrowSharp /> İcra et
              </Button>
              {step.current == 1 &&
              <Button style={{marginLeft: 5}} type='button' onClick={() => saveReport(reportForm.current, sqlQuery, params, step.current, uiContext).then(data => {
                navigate('/')
              })} size='small' variant="contained" color="primary">
                <SaveAsRounded /> Yadda saxla
              </Button>}
            </Box>
          </Grid>

        </Grid>

        {reportResult &&
          <Grid margin={2} container spacing={2} size={6}>
            <Grid size={12}>
              <DenseTable setFilter={setFilters} values={reportResult} />
            </Grid>
            <Grid size={12}>
              <Box display="flex" flexWrap="wrap">
                {filters.map((param, key) =>
                  <Item>
                    <FormControl sx={{ minWidth: 120 }} fullWidth size="small">
                      <TextField
                        fullWidth
                        name={'fields[' + param + ']'}
                        size='small'
                        label={param}
                        defaultValue={param}
                        required
                      />
                    </FormControl>
                  </Item>
                )}
              </Box>
            </Grid>

          </Grid>

        }
      </Box>
    </Box>


  )
};

export function DenseTable(props) {
  const { values } = props;
  const { setFilter } = props;
  const icon = <CheckBoxOutlineBlank fontSize="small" />;
  const checkedIcon = <CheckBox fontSize="small" />;
  return (
    <React.Fragment>
      <Autocomplete
        style={{ minWidth: '100%' }}
        multiple options={values}
        disableCloseOnSelect
        onChange={(e, value) => setFilter(() => value)}
        getOptionLabel={option => option}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                value={option}
                checked={selected}

              />
              {option}
            </li>
          )
        }}
        renderInput={(params) => {
          return (
            <TextField {...params} label="Sütunlar" placeholder="Sütunlar" />
          )
        }}
      >
      </Autocomplete>

      <Divider />
    </React.Fragment>
  );
}

async function saveReport(form, sql, params, step, uiContext) {
  return await catchAsync({
    endpoint: Endpoint.get(services.report_create).url,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: () => validation(form, sql, params, step),
    uiContext
  })
}

function validation(form, sql, params, step) {
  const formData = new FormData(form)
  const request = {}

  for (let form of [...formData]) {

    const [key, value] = form
    _.set(request, key, value)
  }

  request.sql = sql
  request.step = step

  if (!request.name)
    throw new Error("Hesabatın adı daxil edilməyib!");

  if (!request.sql)
    throw new Error("Hesabatın SQL sorğusu daxil edilməyib!");

  if (/(update|insert|delete|truncate|drop|alter|create|revoke|commit|rollback)\s+/muis.test(request.sql))
    throw new Error("Hesabatın SQL sorğusu düzgün deyil. Bazadan yalnız məlumatların oxunması mümkündür!");

  if (!request.report_folder)
    throw new Error("Hesabat qovluğu seçilməyib!");

  if (!request.database)
    throw new Error("SQL-in işləyəcəyi baza seçilməyib!");

  if (!request.cron_job)
    throw new Error("İşləmə tezliyi seçilməlidir!");

  if (!request.report_table)
    throw new Error("Hesabatın cədvəl adı daxil edilməyib");

  if (!form.checkValidity()) {
    form.reportValidity()
    throw new Error("Forma elementləri tam doldurulmayıb")
  }

  return request;

}

export default ReportForm;