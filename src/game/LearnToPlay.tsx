"use client"

import React from "react"
import styled from "@emotion/styled"
import { theme } from "./theme"
import { Typography } from "./Typography"
import { useAsset } from "./AssetContext"

const Page = styled.div({
  minHeight: "100vh",
  backgroundColor: theme.custom.colors.lightGray1,
})

const Container = styled.div({
  maxWidth: "768px",
  margin: "0 auto",
  padding: "40px 16px",
})

const Header = styled.header({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "24px",
})

const Icon = styled.img({
  height: "80px",
  width: "80px",
  borderRadius: "8px",
  objectFit: "cover",
})

const Title = styled.h1({
  ...theme.typography.h4,
  margin: 0,
  color: theme.custom.colors.mitRed,
})

const BackLink = styled.a({
  display: "inline-flex",
  alignItems: "center",
  marginTop: "8px",
  color: theme.custom.colors.mitRed,
  ...theme.typography.subtitle3,
  ":hover": {
    textDecoration: "underline",
  },
})

const Sections = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
})

const Section = styled.section({
  borderRadius: "16px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  backgroundColor: `${theme.custom.colors.white}cc`,
  padding: "16px",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
})

const SectionBody = styled(Typography)({
  marginTop: "4px",
  color: theme.custom.colors.darkGray2,
})

const List = styled.ul({
  marginTop: "8px",
  paddingLeft: "20px",
  listStyleType: "disc",
  color: theme.custom.colors.darkGray2,
  ...theme.typography.body2,
  "& > li": {
    marginBottom: "4px",
  },
})

export default function LearnToPlay() {
  const asset = useAsset()
  return (
    <Page>
      <Container>
        <Header>
          <Icon src={asset("icon.png")} alt="Hack Snack icon" />
          <div>
            <Title>Learn to Play</Title>
            <BackLink href="#/">Back to the game</BackLink>
          </div>
        </Header>

        <Sections>
          <Section>
            <Typography variant="h5" component="h2">
              How the Game Works
            </Typography>
            <SectionBody variant="body2">
              This game is a quick puzzle sprint. Every few days, there is a new
              set of puzzles. Solve each puzzle to unlock a token: a word, number,
              or symbol. Tokens combine to reveal a password. The password
              unlocks a fun fact about an MIT course!
            </SectionBody>
            <List>
              <li>When you have a puzzle guess, click the Unlock button.</li>
              <li>Puzzles turn green once the token is guessed correctly.</li>
              <li>Use the Next and Prev buttons to move between puzzles.</li>
              <li>Try earlier dates to explore other puzzle sets.</li>
            </List>
          </Section>

          <Section>
            <Typography variant="h5" component="h2">
              Puzzle Types
            </Typography>
            <List>
              <li>Rebus: Solve an emoji or symbol phrase.</li>
              <li>Scramble: Unscramble letters to find the word.</li>
              <li>Riddle: Answer a short riddle to unlock a word.</li>
              <li>Equation: Solve a short math prompt for the answer.</li>
              <li>Image: Solve a picture-based tile puzzle.</li>
              <li>Map: Identify a country based on the street view.</li>
            </List>
          </Section>

          <Section>
            <Typography variant="h5" component="h2">
              Tips
            </Typography>
            <List>
              <li>Keep guesses short and simple.</li>
              <li>Ask for a hint or move between puzzles if stuck.</li>
              <li>
                When the password shows up, do not use it. It's been hacked!
              </li>
            </List>
          </Section>
        </Sections>
      </Container>
    </Page>
  )
}
