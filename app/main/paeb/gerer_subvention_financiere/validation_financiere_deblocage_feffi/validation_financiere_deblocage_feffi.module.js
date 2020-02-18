(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.validation_financiere_deblocage_feffi', [])
        .run(notification)
        .config(config);

        var vs = {};
        var affichage;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_validation_financiere_deblocage_feffi', {
            url      : '/donnees-de-base/gerer_subvention_financiere/validation_financiere_deblocage_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/validation_financiere_deblocage_feffi/validation_financiere_deblocage_feffi.html',
                    controller : 'Validation_financiere_deblocage_feffiController as vm'
                }
            },
            bodyClass: 'validation_financiere_deblocage_feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Validation_financiere_deblocage_feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.validation_financiere_deblocage_feffi', {
            title: 'Validation financiere feffi',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_subvention_financiere_validation_financiere_deblocage_feffi',
            weight: 3,
            badge:vs,
            hidden:function()
            {
                    return affichage;
            }
        });
    }

    function notification($cookieStore,apiFactory,$interval,loginService)
    {
        var id_user = $cookieStore.get('id');
       
        
        

        

        if (id_user > 0) 
        {
            var permission = [];
            
            apiFactory.getDemande_realimentationByInvalide("count_demande_feffi",Number(3)).then(function(result) 
            {
                var x = result.data.response;
                vs.content = x[0].nombre ;
                vs.color = '#F44336' ;
              console.log(x);

            });

            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["DAAF"];
                affichage =  loginService.gestionMenu(permissions,permission);  

                //**************************************************
                if (id_user && !affichage) 
                {
                    $interval(function(){apiFactory.getDemande_realimentationByInvalide("count_demande_feffi",Number(3)).then(function(result) 
                    {
                        var resultat = result.data.response;

                        if (vs.content != resultat[0].nombre) 
                        {
                            vs.content = resultat[0].nombre ;
                        };
                        
                    

                    });},15000) ;
                }
                //**************************************************
                      
                

            });
        }
     
    }

})();
