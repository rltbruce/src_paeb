(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_dpfi.convention_suivi_f_dpfi', [])
        .run(notification)
        .config(config);
        var vs = {};
        var affichage;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_daaf_feffi_suivi_f_dpfi_convention_suivi_f_dpfi', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_daaf_feffi/suivi_f_dpfi/convention_suivi_f_dpfi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_daaf_feffi/suivi_f_dpfi/convention_suivi_f_dpfi/convention_suivi_f_dpfi.html',
                    controller : 'Convention_suivi_f_dpfiController as vm'
                }
            },
            bodyClass: 'convention_suivi_f_dpfi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_f_dpfi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_dpfi.convention_suivi_f_dpfi', {
            title: 'Validation technique activitée (DPFI)',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_gerer_subvention_financiere_niveau_daaf_feffi_suivi_f_dpfi_convention_suivi_f_dpfi',
            weight: 1,
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
            
            apiFactory.getDemande_realimentationByInvalide("count_demande_feffi",Number(2)).then(function(result) 
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
                var permissions = ["DPFI","ADMIN"];
                affichage =  loginService.gestionMenu(permissions,permission);  

                //**************************************************
                if (id_user && !affichage) 
                {
                    $interval(function(){apiFactory.getDemande_realimentationByInvalide("count_demande_feffi",Number(2)).then(function(result) 
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
