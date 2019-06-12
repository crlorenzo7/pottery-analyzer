var config={
    server:'/'
}

const MAX_MODELS=500;

const IDIOMAS=[
    {valor:"es",nombre:"Español"},
    {valor:"en",nombre:"Inglés"}
]

const MENU_APP=[
    {
        nombre:'Inicio',
        value:'home',
        submenu:[]
    },
    {
        nombre:'Galeria',
        value:'gallery',
        submenu:[]
    },
    {
        nombre:'Sobre Mi',
        value:'about',
        submenu:[]
    }
];

const TEXTURAS=[
    {
        nombre:'wood',
        img:'light-wood.png'
    },
    {
        nombre:'metal',
        img:'metal.png'
    },
    {
        nombre:'pottery',
        img:'brown-pottery.png'
    },
    {
        nombre:'patron',
        img:'pattern-pottery.png'
    },
    {
        nombre:'patron2',
        img:'pattern-pottery2.png'
    }
]

const MENU_HOME=[
    {
        nombre:'Mis Modelos',
        value:'mis-modelos',
        submenu:[]
    },
    {
        nombre:'Mi Cuenta',
        value:'mi-cuenta',
        submenu:[]
    },
    {
        nombre:'Configuracion',
        value:'configuracion',
        submenu:[]
    }
];



var LOGIN_FORM={
    id:"login-form",
    name:"login-form",
    method:"post",
    action:"login",
    fields:[
        {
            fieldType:"input",
            type:"text",
            required:"required",
            placeholder:"username",
            value:"",
            id:"nick",
            icon:"home"
        },
        {
            fieldType:"input",
            type:"password",
            required:"required",
            placeholder:"password",
            value:"",
            id:"password",
            icon:"llave"
        }
    ],
    submitLabel:"Iniciar Sesion"
}

var SIGNUP_FORM={
    id:"signup-form",
    name:"signup-form",
    method:"post",
    action:"signup",
    fields:[
        {
            fieldType:"input",
            type:"text",
            required:"required",
            placeholder:"username",
            value:"",
            id:"nick",
            icon:"home"
        },
        {
            fieldType:"input",
            type:"email",
            required:"required",
            placeholder:"email",
            value:"",
            id:"email",
            icon:""
        },
        {
            fieldType:"input",
            type:"password",
            required:"required",
            placeholder:"password",
            value:"",
            id:"password",
            icon:"llave"
        },
        {
            fieldType:"input",
            type:"password",
            required:"required",
            placeholder:"retype password",
            value:"",
            id:"rpassword",
            icon:"llave"
        }
    ],
    submitLabel:"Registrar"
}

