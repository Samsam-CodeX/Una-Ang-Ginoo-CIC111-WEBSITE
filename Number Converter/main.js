const numLib = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  0: 'zero',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
  15: 'fifteen',
  16: 'sixteen',
  17: 'seventeen',
  18: 'eighteen',
  19: 'nineteen',
  20: 'twenty',
  30: 'thirty',
  40: 'forty',
  50: 'fifty',
  60: 'sixty',
  70: 'seventy',
  80: 'eighty',
  90: 'ninety'
};

const cellGroup = {
  2: 'thousand',
  3: 'million',
  4: 'billion',
  5: 'trillion',
  6: 'quadrillion',
  7: 'quintillion',
  8: 'sextillion',
  9: 'septillion',
  10: 'octillion',
  11: 'nonillion',
  12: 'decillion',
  13: 'undecillion',
  14: 'duodecillion'
};

const decimalPlaceValue = {
  1: 'tenths',
  2: 'hundredths',
  3: 'thousandths',
  4: 'ten-thousandths',
  5: 'hundred-thousandths',
  6: 'millionths',
  7: 'ten-millionths',
  8: 'hundred-millionths',
  9: 'billionths',
  10: 'ten-billionths',
  11: 'hundred-billionths',
  12: 'trillionths',
  13: 'ten-trillionths',
  14: 'quadrillionths',
  15: 'ten-quadrillionths',
  16: 'hundred-quadrillionths',
  17: 'quintillionths',
  18: 'ten-quintillionths',
  19: 'hundred-quintillionths',
  20: 'sextillionths'
};

function convert() {
  const values = document.getElementById('textBox').value.split('.')
  
  const integerValue = values[0];
  let floatValue = values[1];
  
  let integerOutput = '';
  let floatOutput = '';
  
  //Group name for integers
  if (integerValue.length <= 3) integerOutput = convertCell(integerValue);
  else {
    const cells = group(integerValue); // returns Array
    const cellLength = cells.length;
    if(cellLength > 14) integerOutput = 'Number too large to handle for your fucking brain';
    else {
      cells.forEach( (cell, i) => {
        let cellName = '';
        let groupName = '';
        
        cellName = convertCell(cell)
        if (cellName == numLib['0'] && i != cells.length - 1 || cellName == numLib['0'] && i == cells.length - 1 && cells.length > 1 && integerOutput.trim() != '') {
          cellName = '';
        };
        
        if (convertCell(cell) != numLib['0']) {
          if (cellGroup[(cellLength - i).toString()]) groupName = ' ' + cellGroup[(cellLength - i).toString()] + ' ';
        };
        
        integerOutput = integerOutput + cellName + groupName;
      });
    };
  };
  
  //Group name for all decimals
  if (floatValue) {
    let zeroPrefixes = 0;
    while (floatValue.endsWith('0')) {
      floatValue = floatValue.slice(0, floatValue.length -1);
    };
    while (floatValue.startsWith('0')) {
      floatValue = floatValue.slice(1);
      zeroPrefixes ++;
    };

    if (floatValue.length <= 3) floatOutput = convertCell(floatValue);
    else {
      const cells = group(floatValue); // returns Array
      const cellsLength = cells.length;
      
      cells.forEach( (cell, i) => {
        let cellName = '';
        let groupName = '';
        
        cellName = convertCell(cell)
        if (cellName == numLib['0'] && i != cells.length - 1 || cellName == numLib['0'] && i == cells.length - 1 && cells.length > 1 && integerOutput.trim() != '') {
          cellName = '';
        };
        
        if (convertCell(cell) != numLib['0']) {
          if (cellGroup[(cellsLength - i).toString()]) groupName = ' ' + cellGroup[(cellsLength - i).toString()] + ' ';
        };
        
        floatOutput = floatOutput + cellName + groupName;
      });
    };
    
    const placeValue = floatValue.length + zeroPrefixes;
    
    if(floatValue.length == 0) floatOutput = '';
    else if (decimalPlaceValue[placeValue.toString()]) floatOutput = floatOutput + ' ' + decimalPlaceValue[placeValue.toString()];
    else floatOutput = 'a ridiculus amount of decimals';
  };
  
  document.getElementById('output').textContent = finalize(integerOutput, floatOutput);
  
  function finalize (integers, decimals) {
    let output = '';
    if (integers && decimals) output = integers + ' and ' + decimals;
    else if (integers && !decimals) output = integers;
    else if (!integers && decimals) output = decimals;
    
    if (output.length > 0) return output.slice(0, 1).toUpperCase() + output.slice(1) + '.';
    else return '';
  };
};








function convertCell(value) {
  if (value.length > 3 || value.length < 1) return '';
  
  if (value == '000') value = '0';
  if (value.length == 3 && value.startsWith('0')) value = value.slice(1);
  if (value.length == 2 && value.startsWith('0')) value = value.slice(1);
  
  let output = '';
  const length = value.length;
  if (length == 1) output = numLib[value[0]];
  
  else if (length == 2) {
    if (numLib[value]) output = numLib[value];
    else {
      output = numLib[value.slice(0, 1) + '0'] + '-' + numLib[value.slice(-1)];
    };
  }
  
  else if (length == 3) {
    let lastTwo = '';
    if (numLib[value.slice(1)]) lastTwo = numLib[value.slice(1)];
    else {
      if (value.slice(1, 2) != 0) lastTwo = numLib[value.slice(1, 2) + '0'] + '-' + numLib[value.slice(-1)];
      else {
        if (value.slice(-1) != 0) lastTwo = numLib[value.slice(-1)];
      }
    };
    
    output = numLib[value.slice(0, 1)] + " " + "hundred" + " " + lastTwo;
  };
  
  return output;
};








function onlyDigits(value) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  let output = '';
  for (i=0; i < value.length; i++) {
    digits.some( digit => {
      if (value[i] == digit) output = output.concat(value[i]);
    });
  };
  return output;
};






function group(value) {
  let groupedValue = [];
  if (value.length > 3) {
    let startSlice = 0;
    for (i=0; i<value.length; i++) {
      const currentRemainder = ((value.length - i) - 1) % 3;
      if (currentRemainder == 0) {
        groupedValue.push(value.slice(startSlice, i + 1));
        startSlice = i + 1;
      };
    };
  } else groupedValue = value;
  return groupedValue;
};
