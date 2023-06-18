import devtools from 'devtools-detect';
if (devtools.isOpen) {
  console.log(
    `%cWell, well, well, looks like I've stumbled upon a hacker! In that case, forget about this dull website and head over to https://terminal.arial.dev.`,
    'color: blue; font-family:serif; font-size: 20px'
  );
}