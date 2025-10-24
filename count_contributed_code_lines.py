import os

def count_lines_in_contributors(base_dir='contributors'):
    total_lines = 0
    file_count = 0

    for root, _, files in os.walk(base_dir):
        for file in files:
            # skip non-code files 
            if not file.endswith(('.js', '.html', '.css')):
                continue

            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    line_count = sum(1 for _ in f)
                    total_lines += line_count
                    file_count += 1
            except Exception as e:
                print(f'⚠️  Could not read {path}: {e}')

    print(f'Total files in "{base_dir}": {file_count}')
    print(f'Total lines in "{base_dir}": {total_lines}')

if __name__ == '__main__':
    count_lines_in_contributors()
