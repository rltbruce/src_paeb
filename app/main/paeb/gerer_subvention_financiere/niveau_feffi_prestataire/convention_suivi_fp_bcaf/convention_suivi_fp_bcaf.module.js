(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.convention_suivi_fp_bcaf', [])
        .run(notification)
        .config(config);
        var vs = {};
        var affichage;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_feffi_prestataire_convention_suivi_fp_bcaf', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_feffi_prestataire/convention_suivi_fp_bcaf:rac?',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_feffi_prestataire/convention_suivi_fp_bcaf/convention_suivi_fp_bcaf.html',
                    controller : 'Convention_suivi_fp_bcafController as vm'
                }
            },
            bodyClass: 'convention_suivi_fp_bcaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_fp_bcaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_feffi_prestataire.convention_suivi_fp_bcaf', {
            title: 'Validation activité financier (DPFI)',
            icon  : 'icon-keyboard-variant',
            state: 'app.paeb_gerer_subvention_financiere_niveau_feffi_prestataire_convention_suivi_fp_bcaf',
            weight: 1,
            badge:vs,
            hidden: function()
            {
                    return affichage;
            }
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
                var permissions = ["DPFI","ADMIN"];
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
            
            apiFactory.getDemande_realimentationByInvalide("count_facture_prestataire",Number(0)).then(function(result) 
            {
                var x = result.data.response;
                vs.content = Number(x[0].nombre_mpe) + Number(x[0].nombre_moe);
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
                    $interval(function(){apiFactory.getDemande_realimentationByInvalide("count_facture_prestataire",Number(0)).then(function(result) 
                    {
                        var resultat = result.data.response;

                        if (vs.content != Number(resultat[0].nombre_mpe) + Number(resultat[0].nombre_moe)) 
                        {
                            vs.content = Number(resultat[0].nombre_mpe) + Number(resultat[0].nombre_moe) ;
                        };
                        
                    

                    });},15000) ;
                }
                //**************************************************
                      
                

            });
        }
     
    }

})();
