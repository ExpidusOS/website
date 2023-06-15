import 'package:flutter/material.dart';
import 'package:expidus_website/utils.dart' show AutoScaler;

final _navItems = {
  '/': 'Home',
  '/download': 'Download',
};

class DefaultLayout extends StatefulWidget {
  const DefaultLayout({ super.key, this.child });

  final Widget? child;

  @override
  State<DefaultLayout> createState() => _DefaultLayoutState();
}

class _DefaultLayoutState extends State<DefaultLayout> {
  @override
  Widget build(BuildContext context) {
    final currentRoute = ModalRoute.of(context) == null ? '/' : ModalRoute.of(context)!.settings.name;
    var isNotLarge = AutoScaler.ltLarge.fits(MediaQuery.of(context));
    return Scaffold(
      appBar: AppBar(
        title: const Text('ExpidusOS'),
        actions: isNotLarge ? null : _navItems.map((k, v) => MapEntry(k,
          Padding(
            padding: const EdgeInsets.all(4.0),
            child: TextButton(
              style: currentRoute == k ?
                (Theme.of(context).textButtonTheme.style ?? const ButtonStyle()).copyWith(
                  foregroundColor: MaterialStatePropertyAll(Theme.of(context).colorScheme.onBackground),
                  backgroundColor: MaterialStatePropertyAll(Theme.of(context).colorScheme.secondaryContainer),
                ) : null,
              onPressed: () {
                if (currentRoute != k) {
                  Navigator.of(context).pushNamed(k);
                }
              },
              child: Text(v),
            ),
          ))).values.toList(),
      ),
      drawer: isNotLarge ? Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: _navItems.map((k, v) => MapEntry(k,
            ListTile(
              selected: currentRoute == k,
              selectedColor: Theme.of(context).colorScheme.onBackground,
              selectedTileColor: Theme.of(context).colorScheme.secondaryContainer,
              onTap: () {
                if (currentRoute != k) {
                  Navigator.of(context).pushNamed(k);
                }
              },
              title: Text(v),
            ))).values.toList(),
        ),
      ) : null,
      body: widget.child != null ? Center(child: widget.child) : null,
    );
  }
}
