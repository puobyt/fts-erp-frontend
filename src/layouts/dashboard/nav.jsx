// import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import React, { useState } from 'react'
import { useEffect } from 'react'
import { List, Collapse } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import { useTheme } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'
import Drawer, { drawerClasses } from '@mui/material/Drawer'

import { usePathname } from 'src/routes/hooks'
import { RouterLink } from 'src/routes/components'

import { varAlpha } from 'src/theme/styles'

import { Logo } from 'src/components/logo'
import { Scrollbar } from 'src/components/scrollbar'

import { NavUpgrade } from '../components/nav-upgrade'
import { WorkspacesPopover } from '../components/workspaces-popover'

// import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export function NavDesktop ({ sx, data, slots, workspaces, layoutQuery }) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(
          theme.vars.palette.grey['500Channel'],
          0.12
        )})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex'
        },
        ...sx
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Box>
  )
}

// ----------------------------------------------------------------------

export function NavMobile ({ sx, data, open, slots, onClose, workspaces }) {
  const pathname = usePathname()

  useEffect(() => {
    if (open) {
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx
        }
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  )
}

// ----------------------------------------------------------------------

export function NavContent ({ data, slots, workspaces, sx }) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState({})

  // Toggle dropdown visibility
  const handleToggle = title => {
    console.log('title sray ,', title)
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title] // Toggle the specific dropdown
    }))
  }
  return (
    <>
      <Logo />
      {slots?.topArea}
      {/* <WorkspacesPopover data={workspaces} sx={{ my: 2 }} />  */}{' '}
      {/* workspace for team work */}
      <Scrollbar fillContent>
        <Box
          component='nav'
          display='flex'
          flex='1 1 auto'
          flexDirection='column'
          sx={{
            ...sx,
            maxHeight: '100vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for Chrome/Safari
            scrollbarWidth: 'none' // Hide scrollbar for Firefox
          }}
        >
          <Box component='ul' gap={0.5} display='flex' flexDirection='column'>
            {data.map(item => {
              console.log('item is here with children', item)
              const isActived = item.path === pathname // Check active state
              const isOpen = openMenus[item.title] || false // Get dropdown toggle state

              return (
                <React.Fragment key={item.title}>
                  {/* Parent Item */}
                  <ListItem disableGutters disablePadding>
                    <ListItemButton
                      onClick={() => item.children && handleToggle(item.title)}
                      component={item.path ? RouterLink : 'div'}
                      to={item.path} // Use 'to' instead of 'href'
                      sx={{
                        pl: 2,
                        py: 1,
                        gap: 2,
                        pr: 1.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontWeight: isActived
                          ? 'fontWeightSemiBold'
                          : 'fontWeightMedium',
                        color: isActived
                          ? 'var(--layout-nav-item-active-color)'
                          : 'var(--layout-nav-item-color)',
                        minHeight: 'var(--layout-nav-item-height)',
                        bgcolor: isActived
                          ? 'var(--layout-nav-item-active-bg)'
                          : 'transparent',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg)'
                        }
                      }}
                    >
                      <Box component='span' sx={{ width: 24, height: 24 }}>
                        {item.icon}
                      </Box>

                      <Box component='span' flexGrow={1}>
                        {item.title}
                      </Box>

                      {/* Dropdown Icon */}
                      {item.children ? (
                        isOpen ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )
                      ) : null}
                    </ListItemButton>
                  </ListItem>

                  {/* Sub Items */}
                  {item.children && (
                    <Collapse in={isOpen} timeout='auto' unmountOnExit>
                      <List component='div' disablePadding>
                        {item.children.map(child => (
                          <ListItem key={child.title} disablePadding>
                            <ListItemButton
                              component={RouterLink}
                              to={child.path}
                              sx={{
                                pl: 4, // Indent sub-items
                                py: 1,
                                gap: 1,
                                typography: 'body2',
                                fontWeight: isActived
                                  ? 'fontWeightSemiBold'
                                  : 'fontWeightMedium',
                                color: 'var(--layout-nav-item-color)',
                                '&:hover': {
                                  bgcolor: 'var(--layout-nav-item-hover-bg)'
                                }
                              }}
                            >
                              <Box
                                component='span'
                                sx={{ width: 20, height: 20, mr: 1 }}
                              >
                                {child.icon}
                              </Box>
                              {child.title}
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              )
            })}
          </Box>
        </Box>
      </Scrollbar>
      {slots?.bottomArea}
    </>
  )
}
