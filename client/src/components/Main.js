import { TITLE } from '../Consts'

import Content from './Content'
import Sidebar from './Sidebar'

function Main() {
  document.title = TITLE;
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

export default Main;