'use client';

import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getSrvUrl } from '@@/config';
import Cookies from 'js-cookie';

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {string}  btnPressed    tipi di bottoni: [ 'impA' | 'impB' | 'impAB']
 * 
 * @returns 
 */
const srvurl = getSrvUrl();

const getUrl = () => {
  return srvurl + '/bale';
};

export default function AdminPanel({ btnPressed }) {

}
