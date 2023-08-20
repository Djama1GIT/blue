import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { HOST, NAME } from '../Consts'

function Subscriptions() {
  document.title = `${NAME} - Subscriptions`;

  return (
    <div className="__content">
        <div className="__wrap_content">

        </div>
    </div>
  );
}

export default Subscriptions;