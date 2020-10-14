(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_cisco_feffi.convention_cisco_feffi_validation', [])
        .run(testPermission)
        .config(config);

        var vs;
        var affichage;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_cisco_feffi_convention_cisco_feffi_validation', {
            url      : '/donnees-de-base/convention_cisco_feffi_validation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_cisco_feffi/convention_cisco_feffi_validation/convention_cisco_feffi_validation.html',
                    controller : 'Convention_cisco_feffi_validationController as vm'
                }
            },
            bodyClass: 'convention_cisco_feffi_validation',
            data : {
              authorizer : true,
              permitted : ["ACC","ADMIN"],
              page: "Convention_cisco_feffi_validation"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_cisco_feffi.convention_cisco_feffi_validation', {
            title: 'Validation convention CISCO/FEFFI',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_subvention_operation_niveau_cisco_feffi_convention_cisco_feffi_validation',
			weight: 3,
            hidden: function()
            {
                return vs;
            }
           /* badge:vs,
            hidden:function()
            {
                    return affichage;
            }*/
        });



    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["BCAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }


    function notification($cookieStore,apiFactory,$interval,loginService)
    {
        var id_user = $cookieStore.get('id');

        if (id_user > 0) 
        {
            var permission = [];

            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               if(user.roles[0]=="BCAF")
               {
                    apiFactory.getAPIgeneraliserREST("count_convention_cisco_feffi","menu","countbyciscovalidation","id_cisco",user.cisco.id,"validation",Number(1)).then(function(result) 
                    {
                        var x = result.data.response;
                        vs.content = x[0].nombre ;
                        vs.color = '#F44336' ;
                        console.log(x);

                    });

               }
               if(user.roles[0]=="ADMIN")
               {
                    apiFactory.getAPIgeneraliserREST("count_convention_cisco_feffi","menu","countbyvalidation","validation",Number(1)).then(function(result) 
                    {
                        var x = result.data.response;
                        vs.content = x[0].nombre ;
                        vs.color = '#F44336' ;
                        console.log(x);

                    });

               }

                var permission = user.roles;
                var permissions = ["BCAF","ADMIN"];
                affichage =  loginService.gestionMenu(permissions,permission);  

                //**************************************************
                if (id_user && !affichage) 
                {   
                    if(user.roles[0]=="BCAF")
                   {
                        $interval(function(){apiFactory.getAPIgeneraliserREST("count_convention_cisco_feffi","menu","countbyciscovalidation","id_cisco",user.cisco.id,"validation",Number(0)).then(function(result) 
                        {
                            var resultat = result.data.response;

                            if (vs.content != resultat[0].nombre) 
                            {
                                vs.content = resultat[0].nombre ;
                            };
                            
                        

                        });},15000) ;
                    }

                    if(user.roles[0]=="ADMIN")
                   {
                        $interval(function(){apiFactory.getAPIgeneraliserREST("count_convention_cisco_feffi","menu","countbyvalidation","validation",Number(0)).then(function(result) 
                        {
                            var resultat = result.data.response;

                            if (vs.content != resultat[0].nombre) 
                            {
                                vs.content = resultat[0].nombre ;
                            };
                            
                        

                        });},15000) ;
                    }
                }
                //**************************************************
                      
                

            });
        }
     
    }

})();
