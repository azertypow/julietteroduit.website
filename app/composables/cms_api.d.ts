type CMS_API_Image_with_details = {
    "extension": string,
    "filename": string,
    "height": number,
    "id": string,
    "mime": string,
    "niceSize": string,
    "template": string,
    "type": string,
    "url": string,
    "width": number
}

type CMS_API_PROJECT_type = "Scénographie" | "Mobilier" | "Architecture"

type CMS_API_BLOCK_theme_options =
    'dark-green'
    | 'green'
    | 'light-green'
    | 'white'
    | 'grey'

type CMS_API_ImageObject_default = {
    "ratio": number
    "alt":      string
    "tiny":     string,
    "small":    string,
    "reg":      string,
    "large":    string,
    "xxl":      string,
}

type CMS_API_Response = {
    code: number,
    status: 'ok' | string,
}


/**
 * BLOCKS
 */

interface ICMS_API_PAGE_CONTENT_BLOCK_default {
    "id": string
    "isHidden": boolean
    "type":
        "text_with_title"
        | "list_of_links"
        | "dropdown"
        | "link"
        | "iframe"
        | "graphic"
        | "array_layout"
        | "themes"
        | "title_section"
        | "child_fondations"
        | "animation"
}

type CMS_API_PAGE_CONTENT_BLOCK_text_with_title = ICMS_API_PAGE_CONTENT_BLOCK_default & {
    "content": {
        "text_with_title_content": string
        "options_theme": CMS_API_BLOCK_theme_options
    }
    "type": "text_with_title"
}

type CMS_API_PAGE_CONTENT_BLOCK_list_of_links = ICMS_API_PAGE_CONTENT_BLOCK_default & {
    "content": {
        "list_of_links_title": "Liste de liens"
        "list_of_links_intro": "<p>Les projets que nous soutenons s'inscrivent dans les objectifs de politique publique, tenant compte du rôle central de l'action des pouvoirs publics dans nos thématiques.&nbsp;<br>Nous soutenons des projets qui facilitent l'adaptation individuelle et collective dans un monde en constante évolution. L'esprit novateur insufflé par notre fondateur reste fortement ancré dans le choix des projets soutenus.</p>"
        "list_of_links_content":             {
            "list_of_links_content_text": string
            "list_of_links_content_link": {
                url: string,
            }
        }[]
        "options_theme": CMS_API_BLOCK_theme_options
    }
    "type": "list_of_links"
}

type CMS_API_PAGE_CONTENT_BLOCK_dropdown = ICMS_API_PAGE_CONTENT_BLOCK_default & {
    "content": {
        "dropdown_title": "Liste déroulante"
        "dropdown_button_theme": "green-button" | "white-button"
        "dropdown_content": [
            {
                "dropdown_content_title": "Nos modes d’actions"
                "dropdown_content_content": "<p>La Fondation Hans Wilsdorf accorde des aides financières individuelles et soutient des organisations, des projets et des partenariats. Ces actions se déploient selon plusieurs modalités : financements directs, au travers d'intermédiaires ou par la participation à des initiatives collectives.</p><p>La création de fondations thématiques s’inscrit dans une dynamique de réponse aux enjeux de cohésion sociale en ciblant des domaines où les solutions publiques ou privées sont fragmentées, incomplètes ou insuffisamment coordonnées. En vue de compléter l’écosystème d’acteurs existants, la Fondation Hans Wilsdorf agit comme un catalyseur, en rassemblant, structurant et amplifiant des dynamiques qui peinent à émerger ou à atteindre une échelle significative.&nbsp;</p>"
                "dropdown_content_link": "https://fr.wikipedia.org/wiki/Fondation_Hans_Wilsdorf"
            }
        ]
        "options_theme": CMS_API_BLOCK_theme_options
    }
    "type": "dropdown"
}

type CMS_API_PAGE_CONTENT_BLOCK_link = ICMS_API_PAGE_CONTENT_BLOCK_default & {
    "content": {
        "link_title": "Lien"
        "link_text": "<p>Envisagez-vous de déposer une demande de soutien&nbsp;? Nous vous avons préparé une marche à suivre afin de faciliter votre démarche. Vous pouvez accéder directement aux formulaires au moyen des liens ci-après.</p>"
        "link_button_text": "Text du bouton"
        "link_link": "https://fr.wikipedia.org/wiki/Fondation_Hans_Wilsdorf"
        "options_theme": CMS_API_BLOCK_theme_options
    }
    "type": "link"
}

type CMS_API_PAGE_CONTENT_BLOCK_iframe = ICMS_API_PAGE_CONTENT_BLOCK_default & {
    "content": {
        link_link: string
    }
    "type": "iframe"
}


type CMS_API_PAGE_CONTENT_BLOCK_graphic = ICMS_API_PAGE_CONTENT_BLOCK_default & {
    "content": {
        "graphic_title": "Graphique 3 cercles"
        "graphic_text": "<p>Envisagez-vous de déposer une demande de soutien&nbsp;? Nous vous avons préparé une marche à suivre afin de faciliter votre démarche. Vous pouvez accéder directement aux formulaires au moyen des liens ci-après.</p>"
        "graphic_circle_content_1": "Une action qui&nbsp; favorise<br>L’expérimentation  La diversité des approches La responsabilisation"
        "graphic_circle_content_2": "Une posture ancrée dans<br>Le respect sans porter de jugement<br>La confiance<br>La proximité"
        "graphic_circle_content_3": "Une attention mise sur<br>Les évolutions sociétales<br>Une approche prospective<br>Les questions d’équité et de justice sociale"
        "options_theme": CMS_API_BLOCK_theme_options
    }
    "type": "graphic"
}

type CMS_API_PAGE_CONTENT_BLOCK_array_layout = ICMS_API_PAGE_CONTENT_BLOCK_default & {
    "content": {
        "array_layout_title": string
        "array_columns": {
            "column_title": string,
            "column_content": (
                {
                    "content": {
                        "list_of_profils_items": {
                            "profile_firstname": string,
                            "profile_lastname": string,
                            "profile_fonction": string,
                            "profile_sector": string
                        }[]
                    },
                    "id": string,
                    "isHidden": false,
                    "type": "list_of_profils"
                }
                |
                {
                    content: {
                        text_without_title_content: string;
                    };
                    id: string;
                    isHidden: boolean;
                    type: "text_without_title";
                }
                )[],
            "id": string
        }[]
        "options_theme": string
    }
    "type": "array_layout"
}

type CMS_API_PAGE_CONTENT_BLOCK_themes = ICMS_API_PAGE_CONTENT_BLOCK_default & {
    "content": {
        "theme_title": "Les thèmes"
        "theme_content": {
            "theme_content_icon": CMS_API_ImageObject_default[]
            "theme_content_link": string
        }[]
        "options_theme": CMS_API_BLOCK_theme_options
    }
    "type": "themes"
}

type CMS_API_PAGE_CONTENT_BLOCK_title_section = ICMS_API_PAGE_CONTENT_BLOCK_default & {
    "content": {
        "title_section_content": string
        "title_section_image": CMS_API_ImageObject_default[]
        "options_theme": CMS_API_BLOCK_theme_options
        "text_without_title_content": string
    }
    "type": "title_section"
}

type CMS_API_PAGE_CONTENT_BLOCK_child_fondations = ICMS_API_PAGE_CONTENT_BLOCK_default & {
    "content": {
        "child_fondations_title": string
        "child_fondations_content": [
            {
                "child_fondations_content_logo": CMS_API_ImageObject_default[]
                "child_fondations_content_text": string
                "child_fondations_content_link": string
            }
        ]
        "options_theme": CMS_API_BLOCK_theme_options
    }
    "type": "child_fondations"
}

type CMS_API_PAGE_CONTENT_BLOCK_animation__content =             {
    "animation_contents_title": string
    "column_content_video": {
        "url": string
    }[]
    "column_content_image_start": CMS_API_ImageObject_default[]
    "column_content_image_end": CMS_API_ImageObject_default[]
}


type CMS_API_PAGE_CONTENT_BLOCK_animation = ICMS_API_PAGE_CONTENT_BLOCK_default & {
    "content": {
        "animation_layout_title": string
        "animation_layout_subtitle": string
        "animation_contents": CMS_API_PAGE_CONTENT_BLOCK_animation__content[]
        "options_theme": CMS_API_BLOCK_theme_options
    }
    "type": "animation"
}

type CMS_API_PAGE_CONTENT_BLOCK =
    ICMS_API_PAGE_CONTENT_BLOCK_default
    & (
        CMS_API_PAGE_CONTENT_BLOCK_text_with_title
        |
        CMS_API_PAGE_CONTENT_BLOCK_list_of_links
        |
        CMS_API_PAGE_CONTENT_BLOCK_dropdown
        |
        CMS_API_PAGE_CONTENT_BLOCK_link
        |
        CMS_API_PAGE_CONTENT_BLOCK_graphic
        |
        CMS_API_PAGE_CONTENT_BLOCK_array_layout
        |
        CMS_API_PAGE_CONTENT_BLOCK_themes
        |
        CMS_API_PAGE_CONTENT_BLOCK_title_section
        |
        CMS_API_PAGE_CONTENT_BLOCK_child_fondations
        |
        CMS_API_PAGE_CONTENT_BLOCK_animation
        |
        CMS_API_PAGE_CONTENT_BLOCK_iframe
    )
