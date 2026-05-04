#!/usr/bin/env node

import 'dotenv/config'
import React from 'react'
import { render } from 'ink'
import { validateEnv } from './shared/env.ts'
import { App } from './tui/App.tsx'

// Validate environment on startup
validateEnv()

// Render the TUI
render(<App />)