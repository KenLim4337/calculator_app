$(document).ready(() => {
    // Store calculator contents
    var calculator = '';

    $('#display').html(display_builder(calculator));

    function safeish_evaluate(input_string) {
        try {
            input_string = input_string.toString()
        } catch {
            // Ignore if already a string
        }

        // Only keep safe symbols
        input_string = input_string.replace(/[^0-9^*x\/()\-+.]/g, '');
        

        // Convert x to multiply
        input_string = input_string.replace(/x/gi, '*');


        // Check for syntax errors, 2 or more symbols in a row that are not parentheses, statements that start with symbols
        if (((input_string.match(/([*\/\-+.])([*\/\-+.])/g)||[]).length > 0) || (input_string.match(/^[*\/+.]/g)||[]).length > 0) {
            calculator = ''
            return "Syntax Error";
        }


        // Check for properly closed parentheses
        if ((input_string.match(/\(/g)||[]).length !== (input_string.match(/\)/g)||[]).length) {
            calculator = ''
            return "Parenthesis Error";
        }

        // Convert ^ to square
        input_string = input_string.replace(/\^/g, '**');
        
        try {
            return eval(input_string);
        } catch {
            calculator = ''
            return "Syntax Error";
        }
    } 

    function display_builder(input_string) {
        result = ''

        try {
            input_string = input_string.toString()
        } catch {
            // Ignore if already a string
        }

        // Empty edge case
        if (input_string.trim() == "") {
            return "0";
        } else {
            result = calculator;
        }

        return result;
    }
    
    function button_parser(input) {
        switch (input) {
            case 'DEL':
                calculator = calculator.substring(0, calculator.length-1);
                break;
            case 'CLR':
                calculator = '';
                break;
            default:
                calculator += input;
                break;
        }

        $('#display').html(display_builder(calculator));
    }  

    $('.input-row > input[type="button"]').click(function(e){
        button_parser($(this).val());
    })
    
    // Evaluate calculator content and show in display, preserving answer for future calculation
    $('#calculator').submit(function(e){
        e.preventDefault();
        if (calculator !== '') {
            calculator = safeish_evaluate(calculator)
            $('#display').html(display_builder(calculator));
            
            // Clear input if error or infinite
            if ((calculator.indexOf('Error') == -1) || (calculator.indexOf('Infinity') == -1)) {
                calculator = '';
            }
        }
    });

});