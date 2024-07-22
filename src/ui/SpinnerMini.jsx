/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import styled, { keyframes } from "styled-components";
import { BiLoaderAlt } from "react-icons/bi";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const SpinnerMini = styled(BiLoaderAlt)`
    width: 2.4rem;
    height: 2.4rem;
    animation: ${rotate} 1.5s infinite linear;
`;

export default SpinnerMini;
