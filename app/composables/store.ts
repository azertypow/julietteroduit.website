export const useBeforeTopPosition_homePage = () => useState('beforeTopPosition_homePage', () => 0)

export const useBeforeTopPosition_about = () => useState('beforeTopPosition_about', () => 0)

export const useProjectInfoIsOpen = () => useState('projectInfoIsOpen', () => false)

export const useNextProjectSlug = () => useState<string | null>('nextProjectSlug', () => null)
