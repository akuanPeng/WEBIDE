(function () {
    const DEFAULT_INDENT = '    '

    function adjust_space (line) {
        var string_list = line.match(/(['"])[^\1]*?\1/g)
        var muli_string = line.match(/\[(=*)\[([^\]\1\]]*)/)
        var comment = line.match(/\-{2}[^\[].*$/)
        line = line.replace(/\s+/g, ' ') // replace all whitespaces inside the string with one space, WARNING: the whitespaces in string will be replace too!
        line = line.replace(/\s?(==|>=|<=|~=|[=><\+\*\/])\s?/g, ' $1 ') // add whitespace around the operator
        line = line.replace(/([^=|\-|(|\s])\s?\-\s?([^\-|\[])/g, '$1 - $2') // just format minus, not for -- or negative number or commentary.
        line = line.replace(/,([^\s])/g, ', $1')
        line = line.replace(/\s,/g, ',')
        // recover the whitespaces in string.
        line = line.replace(/(['"])[^\1]*?\1/g, function () {
            return string_list.shift()
        })
        if (muli_string && muli_string[0]) line = line.replace(/\[(=*)\[([^\]\1\]]*)/, muli_string[0])
        if (comment && comment[0]) line = line.replace(/\-{2}[^\[].*$/, comment[0])
        return line
    }

    function luaBeautifier(str, indent) {
        indent = indent || DEFAULT_INDENT
        if (Number.isInteger(indent)) {
            indent = ' '.repeat(indent)
        }
        var $currIndent = 0,
            $nextIndent = 0,
            $prevLength = 0,
            $extIndent = 0,
            $lastIndent = 0,
            $template = 0
        var new_code = str.split(/\r?\n/g).map(function (line, line_number) {
            var $template_flag = false
            if ($template) {
                var res2 = line.match(/\](=*)\]/)
                if (res2 && $template == res2[1].length + 1) {
                    $template_flag = true
                    if ($template && !/]=*]$/.test(line)) {
                        var [comment, code] = line.split(/\]=*\]/, 2)
                        line = comment + ']' + '='.repeat($template-1) + ']' + adjust_space(code)
                        $template = 0
                    }
                    $template = 0
                } else {
                    return line
                }
            }
            var res1 = line.match(/\[(=*)\[/)
            if (res1) {
                $template = res1[1].length + 1
            }

            if (!$template_flag) {
                line = line.trim() // remote all spaces on both ends
                line = adjust_space(line)
            }
            if (!line.length) {
                return ''
            }
            var raw_line = line
            line = line.replace(/(['"])[^\1]*?\1/, '') // remove all quoted fragments for proper bracket processing
            line = line.replace(/\s*--.+/, '') // remove all comments; this ignores long bracket style comments
            if ( // open a level; increase next indentation; don't change current one
                /^((local )?function|repeat|while)\b/.test(line) && !/\bend\s*[\),;]*$/.test(line) ||
                /\b(then|do)$/.test(line) && !/^elseif\b/.test(line) || // only open on 'then' if there is no 'elseif'
                /^if\b/.test(line) && /\bthen\b/.test(line) && !/\bend$/.test(line) || // only open on 'if' if there is no 'end' at the end
                /\bfunction ?(?:\w+ )?\([^\)]*\)$/.test(line) && !/\bend$/.test(line)
            ) {
                $nextIndent = $currIndent + 1
            } else if ( // close the level; change both current and next indentation
                /^until\b/.test(line) ||
                /^end\s*[\),;]*$/.test(line) ||
                /^end\s*\)\s*\.\./.test(line) || // this is a special case of 'end).."some string"'
                /^else(if)?\b/.test(line) && /\bend$/.test(line)
            ) {
                $nextIndent = --$currIndent
            } else if ( // keep the level; decrease the current indentation; keep the next one
                /^else\b/.test(line) ||
                /^elseif\b/.test(line)
            ) {
                $nextIndent = $currIndent
                $currIndent = $currIndent - 1
            }
            var $brackets = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length // capture unbalanced brackets
            var $curly = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length // capture unbalanced curly brackets

            // close (curly) brackets if needed
            if ($curly < 0) {
                $currIndent += $curly
            }
            if ($brackets < 0) {
                $currIndent += $brackets
            }
                $nextIndent += $brackets + $curly
            // console.log({last: $lastIndent, curr: $currIndent, next: $nextIndent, ext: $extIndent})
            if ($currIndent - $lastIndent > 1) {
                $extIndent += $nextIndent - $lastIndent - 1
                $nextIndent = $currIndent = 1 + $lastIndent
            }
            if ($currIndent - $lastIndent < -1 && $extIndent > 0) {
                $extIndent += $currIndent - $lastIndent + 1
                $currIndent = -1 + $lastIndent
            }
            if ($nextIndent < $currIndent) {
                $nextIndent = $currIndent
            }
            // console.log({last: $lastIndent, curr: $currIndent, next: $nextIndent, ext: $extIndent})
            if ($currIndent < 0) {
                console.warn(`WARNING: negative indentation at line ${line_number}: ${raw_line}`)
                process.exit()
            }

            var new_line = (raw_line.length && $currIndent > 0 && !$template_flag ? indent.repeat($currIndent) : '') + raw_line


            var $useful = $prevLength > 0 || raw_line.length > 0
            $lastIndent = $currIndent

            $currIndent = $nextIndent
            $prevLength = raw_line.length
            if ($useful) return new_line
        })
        if ($currIndent > 0) console.warn('WARNING: positive indentation at the end')
        return new_code.join('\n')
    }
    if (window) window.luaBeautifier = luaBeautifier;
})()
