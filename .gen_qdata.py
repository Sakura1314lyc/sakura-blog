"""Regenerate QDATA and fix quiz mode bugs in 军事理论题库.html"""
import docx, re, json, html as html_mod

FILES = [
    (r'd:\Mizuki\Mizuki\第1章 中国国防  题库（2025年）(1).docx', 0),
    (r'd:\Mizuki\Mizuki\第2章 国家安全 题库（2025年）(1).docx', 1),
    (r'd:\Mizuki\Mizuki\第3章 军事思想 题库（2025年）(1).docx', 2),
    (r'd:\Mizuki\Mizuki\第4章 现代战争 题库（2025年）(1).docx', 3),
    (r'd:\Mizuki\Mizuki\第5章 信息化装备 题库（2025年）(1).docx', 4),
]

def parse_docx(filepath):
    doc = docx.Document(filepath)
    lines = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    sections = {'fill': [], 'single': [], 'multi': [], 'judge': []}
    current = None
    for line in lines:
        if '填空' in line: current = 'fill'; continue
        elif '单项' in line: current = 'single'; continue
        elif '多项' in line: current = 'multi'; continue
        elif '判断' in line: current = 'judge'; continue
        elif re.match(r'^[五六七八九十]、', line) or line.startswith('第') or line in ('第一章','第二章','第三章','第四章','第五章'):
            current = None; continue
        if not current: continue
        sections[current].append(line)
    return sections

def parse_questions(sections):
    result = {'fill': [], 'single': [], 'multi': [], 'judge': []}

    # Parse fill
    for line in sections['fill']:
        m = re.match(r'(\d+)[、.)](.+)', line)
        if not m: continue
        qnum, text = m.group(1), m.group(2)
        ans_m = re.search(r'【(.+?)】', text)
        answer = ans_m.group(1) if ans_m else ''
        # Build question text: keep 【】 markers for quiz rendering, remove number prefix
        question = text.strip()
        # Remove answer and leading number for clean question text
        q_clean = re.sub(r'【.+?】', '', text).strip()
        result['fill'].append({'num': qnum, 'question': question, 'q_clean': q_clean, 'answer': answer})

    # Parse single choice
    i = 0
    while i < len(sections['single']):
        line = sections['single'][i]
        m = re.match(r'(\d+)[、.)](.+)', line)
        if not m: i += 1; continue
        qnum, text = m.group(1), m.group(2)
        ans_m = re.search(r'【\s*([A-E])\s*】\s*$', text)
        answer = ans_m.group(1) if ans_m else ''
        question = re.sub(r'【\s*[A-E]\s*】\s*$', '', text).strip()
        options = []
        j = i + 1
        while j < len(sections['single']):
            opt_m = re.match(r'([A-E])[.、\s]+(.+)', sections['single'][j])
            if opt_m:
                options.append([opt_m.group(1), opt_m.group(2)])
                j += 1
            else:
                if re.match(r'(\d+)[、.)]', sections['single'][j]): break
                j += 1
        i = j
        result['single'].append({'num': qnum, 'question': question, 'answer': answer, 'options': options})

    # Parse multi choice
    i = 0
    while i < len(sections['multi']):
        line = sections['multi'][i]
        m = re.match(r'(\d+)[、.)](.+)', line)
        if not m: i += 1; continue
        qnum, text = m.group(1), m.group(2)
        ans_m = re.search(r'【\s*([A-E]+)\s*】\s*$', text)
        answer = ans_m.group(1) if ans_m else ''
        question = re.sub(r'【\s*[A-E]+\s*】\s*$', '', text).strip()
        options = []
        j = i + 1
        while j < len(sections['multi']):
            opt_m = re.match(r'([A-E])[.、\s]+(.+)', sections['multi'][j])
            if opt_m:
                options.append([opt_m.group(1), opt_m.group(2)])
                j += 1
            else:
                if re.match(r'(\d+)[、.)]', sections['multi'][j]): break
                j += 1
        i = j
        result['multi'].append({'num': qnum, 'question': question, 'answer': answer, 'options': options})

    # Parse judge
    for line in sections['judge']:
        m = re.match(r'(\d+)[、.)](.+)', line)
        if not m: continue
        qnum, text = m.group(1), m.group(2)
        ans_m = re.search(r'【\s*(对|错|正确|错误|√|×)\s*】', text)
        if ans_m:
            answer = '对' if ans_m.group(1) in ('对', '正确', '√') else '错'
        else:
            answer = ''
        question = re.sub(r'【\s*(对|错|正确|错误|√|×)\s*】', '', text).strip()
        result['judge'].append({'num': qnum, 'question': question, 'answer': answer})

    return result

# Generate QDATA
qdata_items = []

for filepath, ch_idx in FILES:
    sections = parse_docx(filepath)
    data = parse_questions(sections)

    for q in data['fill']:
        qdata_items.append({
            'type': 'fill',
            'ch': ch_idx,
            'q': q['question'],  # Keep 【】 markers for quiz rendering
            'a': q['answer'],
            'idx': int(q['num'])
        })

    for q in data['single'] + data['multi']:
        qdata_items.append({
            'type': 'choice',
            'ch': ch_idx,
            'q': q['question'],
            'a': q['answer'],
            'opts': q['options'],
            'idx': int(q['num'])
        })

    for q in data['judge']:
        qdata_items.append({
            'type': 'judge',
            'ch': ch_idx,
            'q': q['question'],
            'a': q['answer'],
            'idx': int(q['num'])
        })

qdata_json = json.dumps(qdata_items, ensure_ascii=False, separators=(',', ': '))

print(f'Generated {len(qdata_items)} QDATA items')

# Read HTML
with open(r'd:\Mizuki\Mizuki\public\军事理论题库.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace QDATA
old_start = html.find('var QDATA = [')
old_end = html.find('];', old_start) + 2
if old_start >= 0 and old_end > old_start:
    new_qdata = 'var QDATA = ' + qdata_json + ';'
    html = html[:old_start] + new_qdata + html[old_end:]
    print('QDATA replaced successfully')
else:
    print('ERROR: Could not find QDATA in HTML')

# Also fix the fill question rendering in RQ():
# Old: replaces 【answer】 with blank span but leaves whitespace gaps
# New: remove 【answer】 markers, replace whitespace gaps with blank spans
old_rq = "if (item.type === 'fill') qt = qt.replace(/【(.*?)】/g, '<span class=\"bk\">(______)</span>');"
new_rq = "if (item.type === 'fill') { qt = qt.replace(/【.*?】/g, '').replace(/\\s{2,}/g, '<span class=\"bk\">______</span>'); }"
html = html.replace(old_rq, new_rq)

# Write back
with open(r'd:\Mizuki\Mizuki\public\军事理论题库.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Done!')
