import React from 'react'
import styled from 'styled-components';
import { ImUndo2, ImRedo2 } from "react-icons/im";
import * as actions from "../actions/otherActions";
import { connect } from 'react-redux';



const Wrapper = styled.div`
position: fixed;
bottom: 0;
left: 50%;
transform: translateX(-50%);
`
const Button = styled.button``

const ToolBox = (props) =>{

return <Wrapper>
    <Button><ImUndo2 size={30} onClick={props.undo}></ImUndo2> 
    </Button>
    <Button><ImRedo2 size={30} onClick={props.redo}></ImRedo2> 
    </Button>
</Wrapper>

}

const mapDispatchToProps = {
    undo: actions.undo,
    redo: actions.redo,
  };

export default connect(null, mapDispatchToProps)(ToolBox);
