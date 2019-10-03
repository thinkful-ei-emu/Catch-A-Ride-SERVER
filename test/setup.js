require('dotenv').config();
const { expect } = require('chai');
const supertest = require('supertest');
const config = require('../src/config');

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');

const { google } = require('googleapis');

global.expect = expect;
global.supertest = supertest;

