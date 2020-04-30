(function ()
{
    'use strict';

    angular
        .module('app.paeb.administration', 
            [
                'app.paeb.administration.utilisateur',
                'app.paeb.administration.profil'
            ])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration', {
            title : 'Administration',
            icon  : 'icon-camera-iris',
            weight: 1,
            hidden: function()
            {
                    return vs;
            }
        });

        msNavigationServiceProvider.saveItem('paeb.administration.utilisateurs', {
            title: 'Utilisateurs',
            icon  : 'icon-account-multiple'
            //state: 'app.population_administration_secteur'
        });

        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases', {
            title: 'Données de base',
            icon  : 'icon-package-variant-closed' //icon-image-filter-tilt-shift
            //state: 'app.population_administration_secteur'
        });
    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
                var permission = user.roles;
                var permissions = ["ADMIN","BCAF","DAAF","DPFI","OBCAF","ODAAF","ODPFI","UFP"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
