import React from 'react';
import { Card, Stack, Button, CircularProgress } from '@mui/material';
import XMLParser from 'react-xml-parser';
import { COOKIE, ERROR, SUBDOMAINS, SUCCESS } from '../utils/constants';
import api from '../utils/api';
import useLoading from '../hooks/useLoading';
import AlertMessage from '../components/AlertMessage';
import useAlertMessage from '../hooks/useAlertMessage';

export default function HomePage() {

  const { isLoading, setIsLoading } = useLoading();
  const { openAlert } = useAlertMessage();

  const handleXml = async () => {
    setIsLoading(true);
    const reqObject = {};

    //  Get xml data as JSON object.
    const xmlObject = await fetch('/config.xml')
      .then(res => res.text())
      .then(data => {
        let xml = new XMLParser().parseFromString(data, 'text/xml');
        return xml;
      });

    const originChildren = xmlObject.children;

    for (let i = 0; i < originChildren.length; i += 1) {
      let { name, children } = originChildren[i];

      //  Get subdomains
      if (name === SUBDOMAINS) {
        reqObject[SUBDOMAINS] = [];
        for (let j = 0; j < children.length; j += 1) {
          let { value } = children[j];
          reqObject[SUBDOMAINS].push(value);
        }
      } else {  //   Get others
        let keyPrefix = COOKIE;
        for (let j = 0; j < children.length; j += 1) {
          let subChildren = children[j].children;

          for (let k = 0; k < subChildren.length; k += 1) {
            let subSubChildren = subChildren[k].children;

            if (subSubChildren.length > 0) {
              for (let l = 0; l < subSubChildren.length; l += 1) {
                let key = `${keyPrefix}:${subSubChildren[l].attributes.name}:${subSubChildren[l].attributes.host}`;
                reqObject[key] = subSubChildren[l].value;
              }
            } else {
              let key = `${keyPrefix}:${subChildren[k].attributes.name}:${subChildren[k].attributes.host}`;
              reqObject[key] = subChildren[i].value;
            }
          }
        }
      }
    }

    await api.post('/test/sendDataToRedis', reqObject)
      .then(response => {
        setIsLoading(false);
        openAlert({ severity: SUCCESS, message: 'The data of config.xml is exported to the redis.' });
      })
      .catch(error => {
        setIsLoading(false);
        openAlert({ severity: ERROR, message: 'The data of config.xml isn\'t exported to the redis.' });
      });
  };

  return (
    <Stack direction="row" justifyContent="center" sx={{ mt: 40 }}>
      <Card sx={{ maxWidth: 200, p: 5 }} title="Please click the button">
        <Stack direction="row" justifyContent="center">
          {
            isLoading ? <CircularProgress /> : <Button variant="contained" onClick={handleXml}>Click here</Button>
          }
        </Stack>
      </Card>
      <AlertMessage />
    </Stack>
  );
}