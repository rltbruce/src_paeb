(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_ufp_feffi_etat.convention_suivi_f_ufp_etat', [])
        //.run(notification)
        .config(config);
        var vs = {};
        var affichage;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_financiere_niveau_ufp_feffi_etat_convention_suivi_f_ufp_etat', {
            url      : '/donnees-de-base/etat_subvention_financiere/niveau_ufp_feffi_etat/convention_suivi_f_ufp_etat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_financiere/niveau_ufp_feffi_etat/convention_suivi_f_ufp_etat/convention_suivi_f_ufp_etat.html',
                    controller : 'Convention_suivi_f_ufp_etatController as vm'
                }
            },
            bodyClass: 'convention_suivi_f_ufp_etat',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_f_ufp_etat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_financiere.niveau_ufp_feffi_etat.convention_suivi_f_ufp_etat', {
            title: 'Etat activité financier',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_etat_subvention_financiere_niveau_ufp_feffi_etat_convention_suivi_f_ufp_etat',
            weight: 1
        });
    }

    function notification($cookieStore,apiFactory,$interval,loginService)
    {
        var id_user = $cookieStore.get('id');

        if (id_user > 0) 
        {
            var permission = [];
            
            apiFactory.getDemande_realimentationByInvalide("count_demande_feffi",Number(1)).then(function(result) 
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
                var permissions = ["UFP","ADMIN"];
                affichage =  loginService.gestionMenu(permissions,permission);  

                //**************************************************
                if (id_user && !affichage) 
                {
                    $interval(function(){apiFactory.getDemande_realimentationByInvalide("count_demande_feffi",Number(1)).then(function(result) 
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
