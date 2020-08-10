(function ()
{
    'use strict';

    angular
        .module('app.paeb.note_agence_acc', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_note_agence_acc', {
            url      : '/donnees-de-base/note_agence_acc',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/note_agence_acc/note_agence_acc.html',
                    controller : 'Note_agence_accController as vm'
                }
            },
            bodyClass: 'note_agence_acc',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "note_agence_acc"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.note_agence_acc', {
            title: 'Attribution des notes AAC',
            icon  : 'icon-nfc-variant',
            state: 'app.paeb_note_agence_acc',
			weight: 5
        });
    }

})();
