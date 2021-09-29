import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {
  Box,
  Deck,
  FlexBox,
  FullScreen,
  mdxComponentMap,
  Notes,
  Progress,
  Slide,
} from 'spectacle';
import HideSlide from './components/hideslide';

import {ThemeProvider} from '@material-ui/core';
import styled from '@material-ui/styles/styled/styled'

import TOC from './components/toc'

import slides_intro, {notes as notes_intro} from './slides/0_intro.mdx';
import slides_pieces, {notes as notes_pieces} from './slides/1_pieces.mdx';
import slides_task, {notes as notes_task} from './slides/2_task.mdx';
import slides_wiki, {notes as notes_wiki} from './slides/3_wiki.mdx';
import slides_future, {notes as notes_future} from './slides/4_future.mdx';
import {material_theme, spectacle_theme, useMuiStyles} from './theme';

const StyledNotes = styled(Notes)({
  color: 'background'
})

console.log('raw slides', slides_intro, slides_intro.map((slide) => (console.log(slide, (<slide></slide>)))))
// have to declare some metadata here bc can't figure out how to export variables!
const toc_slides = [
  {
    name: 'intro',
    display: 'Introduction',
    slides: slides_intro,
    notes: notes_intro
  },
  {
    name: 'pieces',
    display: 'Pieces',
    slides: slides_pieces,
    notes: notes_pieces
  },
  {
    name: 'task',
    display: 'Task',
    slides: slides_task,
    notes: notes_task
  },
  {
    name: 'wiki',
    display: 'Wiki',
    slides: slides_wiki,
    notes: notes_wiki
  },
  {
    name: 'future',
    display: 'Future',
    slides: slides_future,
    notes: notes_future
  },
]

const toc_slides_flat = Array.prototype.concat(...toc_slides.map((slide_group) => (
    slide_group.slides.map((slide, idx) => ({slide:slide, group:slide_group.name, notes:slide_group.notes[idx]}))
)))

console.log(toc_slides_flat)

const transition = [
  {display:'none'},
  {display:'unset'},
  {display:'none'}
]

export const template = () => (
    <FlexBox
        justifyContent="space-between"
        flexDirection="column"
        position="absolute"
        left={0}
        height={1}
    >

      <TOC slides={toc_slides_flat}/>
      <Box padding="1em 0">
        <FullScreen style={{marginLeft:0, marginRight:0}}/>
      </Box>
    </FlexBox>
);

function Presentation(){
  // iterate through slides here.
  // MDXSlide elements should have exported
  // variables as props (or at least
  // MDXCreateElement does in the debugger)
  const classes = useMuiStyles();

  return(
  <MDXProvider components={mdxComponentMap}>
    <ThemeProvider theme={material_theme}>
    <Deck theme={spectacle_theme} template={template}>
      {toc_slides_flat.map((slide, i) =>
          // slides.map((MDXSlide, i) => [MDXSlide, all_notes[j][i]]).
          //     map(([MDXSlide, MDXNote], i) => (

          <HideSlide
            key={`slide-${i}`}
            slideNum={i}
            backgroundColor={'background'}
            bufferSlides={2}
            transition={transition}
          >
            <slide.slide key={`innerslide-${i}`}/>
            <StyledNotes color={"background"}>
              <div className={"notes-style-container"}>
                <slide.notes  color={"background"} />
              </div>
            </StyledNotes>
          </HideSlide>

      )}
    </Deck>
    </ThemeProvider>
  </MDXProvider>)
}

export default Presentation
//
